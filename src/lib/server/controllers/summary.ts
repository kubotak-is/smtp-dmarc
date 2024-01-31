import type { OrgSummary, SpfAndDkimRate } from '$lib/types'
import type { MongoClient } from 'mongodb'
import { useMongo } from '../modules/mongodb/client'

function toUnixTimestamp(dateString: string) {
  return Math.floor(new Date(dateString).getTime() / 1000)
}

export const aggregateOrgSummary = async (
  mongodb: MongoClient,
  startDate: string,
  endDate: string
): Promise<OrgSummary[] | undefined> => {
  const rate = await aggregateSpfAndDkimRate(mongodb, startDate, endDate)
  const count = await aggregateDMARCReportsCount(mongodb, startDate, endDate)
  if (rate === undefined || count === undefined) {
    return
  }
  // rateとcountを結合
  return rate
    .map((r) => {
      const c = count.find((c) => c.org_name === r.org_name)
      return { ...r, count: c?.count ?? 0 } as OrgSummary
    })
    .sort((a, b) => b.count - a.count)
}

async function aggregateDMARCReportsCount(
  mongodb: MongoClient,
  startDate: string,
  endDate: string
) {
  const collection = useMongo(mongodb).collection('reports')
  try {
    // 集計パイプラインの定義
    const pipeline = [
      {
        // 日付範囲でフィルタリング
        $match: {
          'report_metadata.date_range.begin': {
            $gte: toUnixTimestamp(startDate),
            $lt: toUnixTimestamp(endDate)
          }
        }
      },
      { $unwind: '$record' },
      {
        // org_nameごとにrow.countの合計を集計
        $group: {
          _id: '$report_metadata.org_name',
          total_count: { $sum: '$record.row.count' }
        }
      },
      {
        // 出力形式を整形
        $project: {
          _id: 0,
          org_name: '$_id',
          count: '$total_count'
        }
      }
    ]
    return await collection.aggregate(pipeline).toArray()
  } catch (err) {
    console.error('An error occurred:', err)
  }
}

async function aggregateSpfAndDkimRate(mongodb: MongoClient, startDate: string, endDate: string) {
  const collection = useMongo(mongodb).collection('reports')
  try {
    const pipeline = [
      {
        // 日付範囲でフィルタリング
        $match: {
          'report_metadata.date_range.begin': {
            $gte: toUnixTimestamp(startDate),
            $lt: toUnixTimestamp(endDate)
          }
        }
      },
      { $unwind: '$record' },
      {
        $project: {
          _id: '$report_metadata.org_name',
          spf: '$record.row.policy_evaluated.spf',
          dkim: '$record.row.policy_evaluated.dkim'
        }
      },
      // SPFとDKIMのパス状態を基に集計
      {
        $group: {
          _id: '$_id',
          total: { $sum: 1 },
          spfPass: {
            $sum: {
              $cond: [{ $eq: ['$spf', 'pass'] }, 1, 0]
            }
          },
          dkimPass: {
            $sum: {
              $cond: [{ $eq: ['$dkim', 'pass'] }, 1, 0]
            }
          }
        }
      },
      // パス率を計算
      {
        $project: {
          _id: 0,
          org_name: '$_id',
          total: 1,
          spfPassCount: '$spfPass',
          spfRate: { $round: [{ $multiply: [{ $divide: ['$spfPass', '$total'] }, 100] }, 1] },
          dkimPassCount: '$dkimPass',
          dkimRate: { $round: [{ $multiply: [{ $divide: ['$dkimPass', '$total'] }, 100] }, 1] }
        }
      }
    ]
    return await collection.aggregate(pipeline).toArray()
  } catch (err) {
    console.error('An error occurred:', err)
  }
}

export const aggregateSpfAndDkimRateForDaily = async (
  mongodb: MongoClient,
  startDate: string,
  endDate: string
): Promise<SpfAndDkimRate[] | undefined> => {
  const collection = useMongo(mongodb).collection('reports')
  try {
    // 集計パイプラインの定義
    const pipeline = [
      {
        // 日付範囲でフィルタリング
        $match: {
          'report_metadata.date_range.begin': {
            $gte: toUnixTimestamp(startDate),
            $lt: toUnixTimestamp(endDate)
          }
        }
      },
      { $unwind: '$record' },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $toDate: {
                  $multiply: [
                    '$report_metadata.date_range.begin',
                    1000 // 秒からミリ秒への変換
                  ]
                }
              }
            }
          },
          dkim: '$record.row.policy_evaluated.dkim',
          spf: '$record.row.policy_evaluated.spf'
        }
      },
      // 日付ごとに集計
      {
        $group: {
          _id: '$date',
          total: { $sum: 1 },
          spfPass: {
            $sum: {
              $cond: [{ $eq: ['$spf', 'pass'] }, 1, 0]
            }
          },
          dkimPass: {
            $sum: {
              $cond: [{ $eq: ['$dkim', 'pass'] }, 1, 0]
            }
          }
        }
      },
      // パス率の計算
      {
        $project: {
          _id: 0,
          date: '$_id',
          spfRate: { $round: [{ $multiply: [{ $divide: ['$spfPass', '$total'] }, 100] }, 2] },
          dkimRate: { $round: [{ $multiply: [{ $divide: ['$dkimPass', '$total'] }, 100] }, 2] }
        }
      },
      // 日付でソート
      { $sort: { date: 1 } }
    ]
    const result = (await collection.aggregate(pipeline).toArray()) as SpfAndDkimRate[]
    return result
  } catch (err) {
    console.error('An error occurred:', err)
  }
}

export const aggregateSpfAndDkimRateForDailyFilterByOrgName = async (
  mongodb: MongoClient,
  orgName: string,
  startDate: string,
  endDate: string
): Promise<SpfAndDkimRate[] | undefined> => {
  const collection = useMongo(mongodb).collection('reports')
  try {
    // 集計パイプラインの定義
    const pipeline = [
      {
        // 組織名と日付範囲でフィルタリング
        $match: {
          'report_metadata.org_name': orgName,
          'report_metadata.date_range.begin': {
            $gte: toUnixTimestamp(startDate),
            $lt: toUnixTimestamp(endDate)
          }
        }
      },
      { $unwind: '$record' },
      // beginを配列から取り出して、数値に変換
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $toDate: {
                  $multiply: [
                    '$report_metadata.date_range.begin',
                    1000 // 秒からミリ秒への変換
                  ]
                }
              }
            }
          },
          dkim: '$record.row.policy_evaluated.dkim',
          spf: '$record.row.policy_evaluated.spf'
        }
      },
      // 日付ごとに集計
      {
        $group: {
          _id: '$date',
          total: { $sum: 1 },
          spfPass: {
            $sum: {
              $cond: [{ $eq: ['$spf', 'pass'] }, 1, 0]
            }
          },
          dkimPass: {
            $sum: {
              $cond: [{ $eq: ['$dkim', 'pass'] }, 1, 0]
            }
          }
        }
      },
      // パス率の計算
      {
        $project: {
          _id: 0,
          date: '$_id',
          spfRate: { $round: [{ $multiply: [{ $divide: ['$spfPass', '$total'] }, 100] }, 2] },
          dkimRate: { $round: [{ $multiply: [{ $divide: ['$dkimPass', '$total'] }, 100] }, 2] }
        }
      },
      // 日付でソート
      { $sort: { date: 1 } }
    ]
    const result = (await collection.aggregate(pipeline).toArray()) as SpfAndDkimRate[]
    return result
  } catch (err) {
    console.error('An error occurred:', err)
  }
}
