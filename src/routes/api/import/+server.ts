import { json } from '@sveltejs/kit'
import { format, subDays } from 'date-fns'
import ImportAction from '$lib/server/controllers/import'

export const POST = async ({ request, locals }) => {
  const data = await request.json()
  const from = data.from ?? format(new Date(), 'yyyy-MM-dd')
  const to = data.to ?? format(subDays(new Date(), 7), 'yyyy-MM-dd')
  const result = await ImportAction(locals.mongodb, from, to)
  return json(result)
}
