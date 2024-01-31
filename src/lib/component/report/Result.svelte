<script lang="ts">
  import type { Result } from '$lib/types'
  export let result: Result
</script>

{#if result === 'pass'}
  <div
    class="inline-flex items-center gap-x-1 rounded-full bg-emerald-100/60 px-2 py-1 text-emerald-600 dark:bg-gray-800"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
      <path
        fill-rule="evenodd"
        d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.75Zm4.196 5.954a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clip-rule="evenodd"
      />
    </svg>
    <span class="text-sm font-normal">{result}</span>
  </div>
{:else if result === 'fail'}
  <div
    class="inline-flex items-center gap-x-1 rounded-full bg-red-100/60 px-2 py-1 text-red-500 dark:bg-gray-800"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
      <path
        fill-rule="evenodd"
        d="M8.074.945A4.993 4.993 0 0 0 6 5v.032c.004.6.114 1.176.311 1.709.16.428-.204.91-.61.7a5.023 5.023 0 0 1-1.868-1.677c-.202-.304-.648-.363-.848-.058a6 6 0 1 0 8.017-1.901l-.004-.007a4.98 4.98 0 0 1-2.18-2.574c-.116-.31-.477-.472-.744-.28Zm.78 6.178a3.001 3.001 0 1 1-3.473 4.341c-.205-.365.215-.694.62-.59a4.008 4.008 0 0 0 1.873.03c.288-.065.413-.386.321-.666A3.997 3.997 0 0 1 8 8.999c0-.585.126-1.14.351-1.641a.42.42 0 0 1 .503-.235Z"
        clip-rule="evenodd"
      />
    </svg>
    <span class="text-sm font-normal">{result}</span>
  </div>
{:else}
  <div
    class="inline-flex items-center gap-x-1 rounded-full bg-gray-100/60 px-2 py-1 text-gray-500 dark:bg-gray-800"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
      <path
        fill-rule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z"
        clip-rule="evenodd"
      />
    </svg>
    <span class="text-sm font-normal">{result}</span>
  </div>
{/if}
