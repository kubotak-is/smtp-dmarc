<script lang="ts">
  import SpfAndDkimRateForDaily from '$lib/component/summary/SpfAndDkimRateForDaily.svelte'
  import ReportList from '$lib/component/report/ReportList.svelte'
  export let data
</script>

<div class="col-span-4">
  <SpfAndDkimRateForDaily summary={data.aggregateSpfAndDkimRate} />
</div>
<div class="col-span-4">
  <ReportList reports={data.reports} />
</div>
