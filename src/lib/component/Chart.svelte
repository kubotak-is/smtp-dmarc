<script lang="ts">
  import { onMount, afterUpdate } from 'svelte'

  let canvas

  export let height = 500
  export let option

  let chart
  onMount(async () => {
    const echarts = await import('echarts')
    chart = echarts.init(canvas, null, { renderer: 'canvas' })
    chart.setOption(option)
    // 画面サイズの変更を検知してchartを再描画
    window.addEventListener('resize', () => {
      if (!chart) return
      chart.resize()
    })
  })
  afterUpdate(() => {
    if (!chart) return
    chart.setOption(option)
  })
</script>

<div bind:this={canvas} style="--chart-height: {height}px;"></div>

<style lang="scss">
  div {
    width: 100%;
    height: var(--chart-height);
  }
</style>
