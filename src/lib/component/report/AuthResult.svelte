<script lang="ts">
  import type { Result } from '$lib/types'
  import Result from '$lib/component/report/Result.svelte'

  export let domain: string
  export let result: Result
</script>

<div class="flex flex-wrap items-center justify-start gap-2">
  <span
    class="inline-flex items-center gap-x-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-normal text-gray-800 dark:bg-gray-800"
    >{domain}</span
  >
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    class="h-4 w-4 grow-0"
  >
    <path
      fill-rule="evenodd"
      d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
      clip-rule="evenodd"
    />
  </svg>
  <Result {result} />
</div>
