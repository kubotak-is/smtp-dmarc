import { connectDB } from '$lib/server/modules/mongodb/client'

export const handle = async ({ event, resolve }) => {
  const mongodb = await connectDB()
  event.locals.mongodb = mongodb
  const response = await resolve(event)
  return response
}
