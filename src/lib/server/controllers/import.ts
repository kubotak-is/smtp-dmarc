import type { MongoClient } from 'mongodb'
import { search } from '../modules/imap/search'
import { useMongo } from '../modules/mongodb/client'

export default async function action(mongodb: MongoClient, from: string, to: string) {
  const [result, collection] = await search([
    'ALL',
    ['SINCE', from],
    ['BEFORE', to],
    ['OR', ['SUBJECT', 'dmarc'], ['FROM', 'dmarc']]
  ])

  const mongoCollection = useMongo(mongodb).collection('reports')
  // FIXME モジュールを分けても良いかも
  await Promise.all(
    collection.map(async (report) => {
      const res = await mongoCollection.updateOne(
        {
          'report_metadata.org_name': report.report_metadata.org_name,
          'report_metadata.report_id': report.report_metadata.report_id
        },
        { $set: report },
        { upsert: true }
      )
      if (res.upsertedCount === 0 && res.matchedCount > 0) {
        result.skipped += res.matchedCount
      }
    })
  )
  console.log('Done')
  return result
}
