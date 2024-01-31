<script lang="ts">
  import type { Result } from '$lib/types'
  export let spfResult: Result
  export let dkimResult: Result

  let borderColor = 'border-l-gray-800'
  $: {
    if (spfResult === 'pass' && dkimResult === 'pass') {
      borderColor = 'border-l-emerald-500'
    } else if (spfResult === 'fail' && dkimResult === 'fail') {
      borderColor = 'border-l-red-500'
    } else if (spfResult === 'fail' || dkimResult === 'fail') {
      borderColor = 'border-l-yellow-500'
    }
  }
  let bgColor = 'bg-white'
  $: {
    if (spfResult === 'pass' && dkimResult === 'pass') {
      bgColor = 'bg-gradient-to-br from-white to-emerald-50'
    } else if (spfResult === 'fail' && dkimResult === 'fail') {
      bgColor = 'bg-gradient-to-br from-white to-red-50'
    } else if (spfResult === 'fail' || dkimResult === 'fail') {
      bgColor = 'bg-gradient-to-br from-white to-yellow-50'
    }
  }
</script>

<div
  class="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-4 {bgColor} rounded-lg border-l-4 border-solid shadow {borderColor}"
>
  <slot />
</div>
