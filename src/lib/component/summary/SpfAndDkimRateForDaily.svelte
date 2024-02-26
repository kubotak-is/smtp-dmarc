<script lang="ts">
  import Chart from '$lib/component/Chart.svelte'
  import type { SpfAndDkimRate } from '$lib/types'

  export let summary: SpfAndDkimRate[]

  $: option = {
    title: {
      text: 'Daily SPF, DKIM and DMARC Rate'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['SPF', 'DKIM', 'DMARC']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: summary.map((s) => s.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'SPF',
        type: 'line',
        data: summary.map((s) => s.spfRate)
      },
      {
        name: 'DKIM',
        type: 'line',
        data: summary.map((s) => s.dkimRate)
      },
      {
        name: 'DMARC',
        type: 'line',
        data: summary.map((s) => s.dmarcRate)
      }
    ]
  }
</script>

<div class="card flex gap-4 p-4 shadow">
  <Chart {option} />
</div>
