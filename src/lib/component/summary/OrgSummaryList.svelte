<script lang="ts">
  import Rate from '$lib/component/summary/Rate.svelte'
  import type { OrgSummary } from '$lib/types'
  export let summary: OrgSummary[]
  export let queryParameter: string
</script>

<div class="card table-container p-4 shadow">
  <table class="table table-hover">
    <thead>
      <tr>
        <th class="w-1/4">Org Name</th>
        <th class="table-cell-fit">Total</th>
        <th class="text-center">SPF Rate</th>
        <th class="text-center">DKIM Rate</th>
        <th class="table-cell-fit"></th>
      </tr>
    </thead>
    <tbody>
      {#each summary as row}
        <tr>
          <td>{row.org_name}</td>
          <td class="table-cell-fit">{row.count}</td>
          <td>
            <Rate rate={row.spfRate} />
          </td>
          <td>
            <Rate rate={row.dkimRate} />
          </td>
          <td class="table-cell-fit">
            <a
              href="/org/{encodeURIComponent(row.org_name)}?{queryParameter}"
              class="variant-filled-surface btn-icon btn-icon-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-4 w-4"
              >
                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path
                  fill-rule="evenodd"
                  d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
