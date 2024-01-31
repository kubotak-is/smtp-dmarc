<script lang="ts">
  export let rate: number

  $: color = rate > 80 ? 'bg-green-500' : rate > 50 ? 'bg-yellow-500' : 'bg-red-500'
</script>

<div class="flex w-full items-center">
  <div class="mx-4 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700">
    <div class="h-5 {color} rounded" style="width: {rate}%"></div>
  </div>
  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{rate}%</span>
</div>
