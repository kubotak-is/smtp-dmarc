<script lang="ts">
  import OrgSummary from '$lib/component/summary/OrgSummary.svelte'
  import SpfAndDkimRateForDaily from '$lib/component/summary/SpfAndDkimRateForDaily.svelte'
  import OrgSummaryList from '$lib/component/summary/OrgSummaryList.svelte'
  export let data

  $: queryParameter = new URLSearchParams({ from: data.from, to: data.to })
</script>

<div class="col-span-4 md:col-span-1">
  <OrgSummary summary={data.orgSummary} />
</div>
<div class="col-span-4 md:col-span-3">
  <SpfAndDkimRateForDaily summary={data.spfAndDkimRate} />
</div>
<div class="col-span-4">
  <OrgSummaryList summary={data.orgSummary} {queryParameter} />
</div>
