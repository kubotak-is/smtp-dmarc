import {
  aggregateOrgSummary,
  aggregateSpfAndDkimRateForDaily
} from '$lib/server/controllers/summary'
import type { MetaTagsProps } from 'svelte-meta-tags'

export const load = async ({ parent, locals }) => {
  const breadcrumbs: { href: string | null; label: string }[] = []

  const { from, to } = await parent()
  const [orgSummary, spfAndDkimRate] = await Promise.all([
    aggregateOrgSummary(locals.mongodb, from, to),
    aggregateSpfAndDkimRateForDaily(locals.mongodb, from, to)
  ])

  const metaTags: MetaTagsProps = Object.freeze({
    titleTemplate: 'SMTP DMARC',
    title: 'SMTP DMARC'
  })
  return {
    breadcrumbs,
    orgSummary,
    spfAndDkimRate,
    metaTagsChild: metaTags
  }
}
