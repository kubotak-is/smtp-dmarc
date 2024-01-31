<script lang="ts">
  import Chart from '$lib/component/Chart.svelte'
  import type { OrgSummary } from '$lib/types'

  export let summary: OrgSummary[]

  $: option = {
    title: {
      text: 'Organization Summary',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0%',
      left: 'center'
    },
    series: [
      {
        name: 'Organization',
        type: 'pie',
        top: '-20%',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 24,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: summary.map((s) => ({
          name: s.org_name,
          value: s.count
        }))
      }
    ]
  }
</script>

<div class="card flex gap-4 p-4 shadow">
  <Chart {option} />
</div>
