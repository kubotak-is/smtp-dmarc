import { format, subDays, addDays } from 'date-fns'

export const load = ({ url }) => {
  const formatDateTemp = 'yyyy-MM-dd'
  const fromRaw = url.searchParams.get('from')
  const toRaw = url.searchParams.get('to')
  const from = fromRaw
    ? format(fromRaw, formatDateTemp)
    : format(subDays(new Date(), 14), formatDateTemp)
  let to = toRaw ? format(toRaw, formatDateTemp) : format(new Date(), formatDateTemp)
  if (from === to) {
    to = format(addDays(new Date(from), 1), formatDateTemp)
  }
  return {
    from,
    to
  }
}
