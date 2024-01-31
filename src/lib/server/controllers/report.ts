import type { MongoClient } from 'mongodb'
import { useMongo } from '../modules/mongodb/client'
import type { Record } from '$lib/types'

function toUnixTimestamp(dateString: string) {
  return Math.floor(new Date(dateString).getTime() / 1000)
}

export const aggregateReport = async (
  mongodb: MongoClient,
  orgName: string,
  startDate: string,
  endDate: string
): Promise<Record[] | undefined> => {
  const collection = useMongo(mongodb).collection('reports')
  try {
    const pipeline = [
      {
        $match: {
          'report_metadata.org_name': orgName,
          'report_metadata.date_range.begin': {
            $gte: toUnixTimestamp(startDate),
            $lt: toUnixTimestamp(endDate)
          }
        }
      },
      { $unwind: '$record' },
      {
        $group: {
          _id: '$record.row.source_ip',
          count: { $sum: 1 },
          row: { $first: '$record.row' },
          identifiers: { $first: '$record.identifiers' },
          auth_results: { $first: '$record.auth_results' }
        }
      },
      {
        $project: {
          _id: 0,
          row: '$row',
          identifiers: '$identifiers',
          auth_results: '$auth_results'
        }
      }
    ]
    const result = await collection.aggregate(pipeline).toArray()
    return result as Record[]
  } catch (err) {
    console.error('An error occurred:', err)
  }
}
