import { aggregateReport } from '$lib/server/controllers/report.js'
import { aggregateSpfAndDkimRateForDailyFilterByOrgName } from '$lib/server/controllers/summary'
import type { MetaTagsProps } from 'svelte-meta-tags'

export const load = async ({ params, locals, parent }) => {
  const { from, to } = await parent()
  const { slug } = params
  const [aggregateSpfAndDkimRate, reports] = await Promise.all([
    aggregateSpfAndDkimRateForDailyFilterByOrgName(locals.mongodb, slug, from, to),
    aggregateReport(locals.mongodb, slug, from, to)
  ])

  const breadcrumbs: { href: string | null; label: string }[] = [{ href: null, label: slug }]

  const metaTags: MetaTagsProps = Object.freeze({
    title: slug
  })
  return {
    breadcrumbs,
    aggregateSpfAndDkimRate,
    reports,
    metaTagsChild: metaTags
  }
}
