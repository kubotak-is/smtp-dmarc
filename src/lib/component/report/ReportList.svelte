<script lang="ts">
  import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton'
  import Report from '$lib/component/report/Report.svelte'
  import type { Record } from '$lib/types'
  export let reports: Record[]

  let paginationSettings = {
    page: 0,
    limit: 50,
    size: reports.length,
    amounts: []
  } satisfies PaginationSettings

  $: paginationSettings.size = reports.length

  $: paginatedSource = reports.slice(
    paginationSettings.page * paginationSettings.limit,
    paginationSettings.page * paginationSettings.limit + paginationSettings.limit
  )
</script>

<div class="card p-4 shadow">
  <div class="flex justify-end py-5">
    <Paginator
      on:page
      bind:settings={paginationSettings}
      showPreviousNextButtons
      showNumerals
      maxNumerals={1}
    />
  </div>

  <div class="grid gap-4">
    {#each paginatedSource as record}
      <Report {record} />
    {/each}
  </div>

  <div class="flex justify-end py-5">
    <Paginator
      on:page
      bind:settings={paginationSettings}
      showPreviousNextButtons
      showNumerals
      maxNumerals={1}
    />
  </div>
</div>
