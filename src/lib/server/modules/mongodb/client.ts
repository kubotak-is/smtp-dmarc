import { MongoClient } from 'mongodb'
import { MONGODB_HOST, MONGODB_PORT, MONGODB_USER, MONGODB_PASSWORD } from '$env/static/private'

const url = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}`
const dbName = 'dmarc'
const client = new MongoClient(url)

export const connectDB = async () => {
  console.log('Connecting to mongodb')
  await client.connect()
  console.log('Connected successfully to mongodb')
  return client
}

export const useMongo = (client: MongoClient) => {
  const db = (name: string) => client.db(name)
  const collection = (name: string) => db(dbName).collection(name)
  return {
    collection
  }
}
