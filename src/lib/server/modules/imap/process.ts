import type { ParsedMail } from 'mailparser'
import type { Report } from '$lib/types'
import { XMLParser } from 'fast-xml-parser'
import zlib from 'zlib'
import AdmZip from 'adm-zip'

const types = [
  'application/zip',
  'application/x-zip-compressed',
  'application/gzip',
  'application/x-gzip'
]

export const process = async (mail: ParsedMail): Promise<Report> => {
  try {
    const result = await Promise.all(
      mail.attachments.map(async (attach): Promise<Report> => {
        if (!types.includes(attach.contentType) || !attach.content) {
          throw new Error('Message without attachments!')
        }

        let xmlData = '' // XMLデータを文字列として保持

        // 添付ファイルの内容に基づいて処理を分岐
        if (attach.contentType === types[0] || attach.contentType === types[1]) {
          // ZIPファイルの場合
          const entries = await unzipAttachment(attach.content) // unzipAttachmentはZIPファイルを解凍し、エントリのリストを返すカスタム関数
          entries.forEach((entry) => {
            xmlData += entry.toString() // エントリの内容をXMLデータに追加
          })
        } else if (attach.contentType === types[2] || attach.contentType === types[3]) {
          // gzipファイルの場合
          xmlData = await unzipGzipAttachment(attach.content) // unzipGzipAttachmentはgzipファイルを解凍し、解凍されたデータを文字列として返すカスタム関数
        } else {
          throw new Error(`Unknown attachment content-type: ${attach.contentType}`)
        }

        // XMLデータの解析
        return new Promise((resolve, reject) => {
          try {
            const options = {
              isArray: (name: string) => name === 'record'
            }
            const parser = new XMLParser(options)
            const parsed = parser.parse(xmlData)
            if (parsed && parsed.feedback) {
              resolve(parsed.feedback as Report)
            } else {
              console.error('Unexpected XML structure:', parsed)
              reject(new Error('Unexpected XML structure'))
            }
          } catch (err) {
            console.error('From:', mail.from)
            console.error('Failed to parse XML:', err)
            reject(err)
            return
          }
        })
      })
    )
    return result[0]
  } catch (err) {
    console.error('Error processing attachments:', err)
    throw err // または必要に応じてエラーを処理
  }
}

async function unzipAttachment(buffer: Buffer): Promise<string[]> {
  const zip = new AdmZip(buffer)
  const zipEntries = zip.getEntries() // ZIP内のファイルリストを取得

  return zipEntries.map((entry) => entry.getData().toString('utf8')) // 各エントリの内容を文字列として返す
}

async function unzipGzipAttachment(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    zlib.unzip(buffer, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf.toString('utf8')) // 解凍された内容を文字列として返す
      }
    })
  })
}
