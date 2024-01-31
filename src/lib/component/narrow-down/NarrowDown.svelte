<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import DatePicker from '$lib/component/narrow-down/DatePicker.svelte'
  import SearchButton from '$lib/component/narrow-down/SearchButton.svelte'
  import XmlImportButton from '$lib/component/narrow-down/XmlImportButton.svelte'

  export let from: string
  export let to: string
  export let disableImport = false

  let dateRangValue

  const dispatch = createEventDispatcher()<{
    search: [Date, Date]
    import: [Date, Date]
  }>

  const handleSearch = () => {
    dispatch('search', dateRangValue)
  }
  const handleImport = () => {
    dispatch('import', dateRangValue)
  }
</script>

<div class="card col-span-4 grid grid-cols-4 gap-4 p-4 shadow">
  <div class="col-span-4 md:col-span-3">
    <DatePicker bind:from bind:to bind:value={dateRangValue} />
  </div>
  <div class="col-span-4 flex grid-cols-3 gap-4 md:col-span-1">
    <div class="w-full md:w-1/3">
      <SearchButton on:click={handleSearch} />
    </div>
    <div class="w-full md:w-2/3">
      <XmlImportButton on:click={handleImport} disabled={disableImport} />
    </div>
  </div>
</div>
