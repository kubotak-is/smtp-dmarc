<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation'
  import { page } from '$app/stores'
  import { format } from 'date-fns'
  import { AppShell } from '@skeletonlabs/skeleton'
  import { AppBar } from '@skeletonlabs/skeleton'
  import { Toast, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton'
  import Breadcrumb from '$lib/component/Breadcrumb.svelte'
  import NarrowDown from '$lib/component/narrow-down/NarrowDown.svelte'
  import Logo from '$lib/asset/smtp_dmarc.svg'

  const toastStore = getToastStore()

  export let data

  const handleSearch = ({ detail }) => {
    const from = format(detail[0], 'yyyy-MM-dd')
    const to = format(detail[1], 'yyyy-MM-dd')
    goto(`?from=${from}&to=${to}`, { invalidate: true })
  }

  let disableImport = false
  const handleImport = async ({ detail }) => {
    console.log(detail)
    disableImport = true
    const from = format(detail[0], 'yyyy-MM-dd')
    const to = format(detail[1], 'yyyy-MM-dd')
    const res = await fetch('/api/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to })
    })
    const result = await res.json()
    const t: ToastSettings = {
      message:
        'imported:' +
        result.imported +
        ' / skipped:' +
        result.skipped +
        ' / failed:' +
        result.failed,
      autohide: false,
      action: {
        label: 'reload',
        response: async () => await invalidateAll()
      }
    }
    toastStore.trigger(t)
    disableImport = false
  }
</script>

<Toast />

<div class="layout">
  <AppShell>
    <svelte:fragment slot="header">
      <AppBar background="bg-gray-200/30 backdrop-blur-lg" shadow="shadow-xl">
        <svelte:fragment slot="lead">
          <h1>
            <img src={Logo} alt="SMTP DMARC" class="ml-2 w-40" />
          </h1>
        </svelte:fragment>
        <svelte:fragment slot="trail">
          <a
            href="https://github.com/kubotak-is/smtp-dmarc"
            target="_blank"
            class="btn-icon hover:variant-soft-primary"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="h-6 w-6 fill-slate-900"
              cursorshover="true"
              ><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
                cursorshover="true"
              ></path></svg
            >
          </a>
        </svelte:fragment>
      </AppBar>
    </svelte:fragment>

    <div class="page-padding flex gap-10">
      <div class="grid w-full grid-cols-3 gap-4">
        <Breadcrumb breadcrumbs={$page.data.breadcrumbs ?? []} />
        <NarrowDown
          from={data.from}
          to={data.to}
          {disableImport}
          on:search={handleSearch}
          on:import={handleImport}
        />
        <slot />
      </div>
    </div>
    <!-- (footer) -->
    <svelte:fragment slot="footer">
      <p class="p-2">
        ©kubotak-is / icon by <a href="https://heroicons.com/" target="_blank">heroicons</a>
      </p>
    </svelte:fragment>
  </AppShell>
</div>

<style lang="scss">
  .layout {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }
</style>
