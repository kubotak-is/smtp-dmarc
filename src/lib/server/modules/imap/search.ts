import Imap from 'imap'
import { simpleParser } from 'mailparser'
import { process } from './process'
import type { Report } from '$lib/types'
import {
  IMAP_FOLDER,
  IMAP_HOST,
  IMAP_PASSWORD,
  IMAP_PORT,
  IMAP_TLS,
  IMAP_USER,
  IMAP_READ_ONLY
} from '$env/static/private'

const imapOptions: Imap.Config = {
  host: IMAP_HOST,
  port: Number(IMAP_PORT),
  user: IMAP_USER,
  password: IMAP_PASSWORD,
  tls: IMAP_TLS === 'true',
  tlsOptions: { rejectUnauthorized: false }
}

type SearchKeySimple = 'ALL' | 'SEEN' | 'UNSEEN' | string // 単純な検索キー
type SearchKeyPair =
  | ['SINCE', string]
  | ['BEFORE', string]
  | ['SUBJECT', string]
  | ['FROM', string]
  | ['TO', string] // キーペア
type SearchKeyOr = ['OR', SearchKeyPair, SearchKeyPair] // OR条件
type SearchCriteria = SearchKeySimple | SearchKeyPair | SearchKeyOr
type ImapSearch = SearchCriteria[]

type Result = {
  result: 'success' | 'error'
  total: number
  target: number
  imported: number
  failed: number
  skipped: number
}

type Collection = Array<{ seqno: number } & Report>

export const search = (searchOption: ImapSearch): Promise<[Result, Collection]> =>
  new Promise((resolve, reject) => {
    const imap = new Imap(imapOptions)
    const result: Result = {
      result: 'success',
      total: 0,
      target: 0,
      imported: 0,
      failed: 0,
      skipped: 0
    }
    const collection: Collection = []
    imap.connect()
    imap.on('error', reject)
    imap.once('ready', async () => {
      imap.openBox(IMAP_FOLDER, true, (err, box) => {
        if (err) throw err
        result.total = box.messages.total
        imap.search(searchOption, function (err, results) {
          if (err) throw err
          if (!results || !results.length) {
            console.error('No DMARC reports found')
            resolve([result, collection])
            return
          }
          result.target = results.length
          const fetch = imap.fetch(results, { bodies: '' })
          fetch.on('message', function (msg) {
            const buffer: number[] = []
            msg.on('body', function (stream) {
              stream.on('data', function (chunk) {
                buffer.push(chunk.toString('utf8'))
              })
            })

            if (IMAP_READ_ONLY === 'false') {
              msg.once('attributes', function (attrs) {
                imap.setFlags([attrs.uid], ['\\Seen'], (flagErr) => {
                  if (flagErr) throw flagErr
                })
              })
            }

            msg.once('end', () => {
              simpleParser(buffer.join(''))
                .then(process)
                .then(async (data) => {
                  collection.push(data)
                  result.imported++
                })
                .catch((err) => {
                  console.log(err)
                  ++result.failed
                })
                .finally(() => {
                  if (result.imported === result.target - result.failed) {
                    resolve([result, collection])
                  }
                })
            })
          })

          fetch.once('error', function () {
            console.log('Fetch error')
            reject([result, collection])
          })

          fetch.once('end', function () {
            console.log('Done fetching all messages!')
            imap.end()
          })
        })
      })
    })
  })
