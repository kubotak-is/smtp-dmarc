<script lang="ts">
  import ReportCard from '$lib/component/report/ReportCard.svelte'
  import InnerBlock from '$lib/component/report/InnerBlock.svelte'
  import AuthResult from '$lib/component/report/AuthResult.svelte'
  import Result from '$lib/component/report/Result.svelte'
  import type { Record } from '$lib/types'
  export let record: Record
</script>

<ReportCard
  spfResult={record.row.policy_evaluated.spf}
  dkimResult={record.row.policy_evaluated.dkim}
>
  <InnerBlock title="Source IP">
    <p>{record.row.source_ip}</p>
  </InnerBlock>
  <InnerBlock title="Envelope From">
    <p>{record.identifiers.envelope_from ?? '-'}</p>
  </InnerBlock>
  <InnerBlock title="Header From">
    <p>{record.identifiers.header_from}</p>
  </InnerBlock>
  <InnerBlock title="Count">
    <p>{record.row.count}</p>
  </InnerBlock>
  <InnerBlock title="Disposition">
    <p>{record.row.policy_evaluated.disposition}</p>
  </InnerBlock>
  <InnerBlock title="DKIM">
    <p><Result result={record.row.policy_evaluated.dkim} /></p>
  </InnerBlock>
  <InnerBlock title="SPF">
    <p><Result result={record.row.policy_evaluated.spf} /></p>
  </InnerBlock>
  <InnerBlock title="Reason">
    <p>type: {record.row.policy_evaluated.reason?.type ?? '-'}</p>
    <p>comment: {record.row.policy_evaluated.reason?.comment ?? '-'}</p>
  </InnerBlock>
  <div
    class="col-span-4 grid grid-cols-1 gap-4 rounded-md border border-white/50 bg-white/50 p-2 md:grid-cols-2 lg:grid-cols-2"
  >
    {#if record.auth_results.dkim}
      <div class="col-span-2 grid gap-2 md:col-span-1">
        <p class="text-sm font-bold text-slate-500">DKIM Auth Results</p>
        <div class="grid gap-2">
          {#each Array.isArray(record.auth_results.dkim) ? record.auth_results.dkim : [record.auth_results.dkim] as dkim}
            <AuthResult domain={dkim.domain} result={dkim.result} />
          {/each}
        </div>
      </div>
    {/if}
    <div class="col-span-2 grid gap-2 md:col-span-1">
      <p class="text-sm font-bold text-slate-500">SPF Auth Results</p>
      <div>
        <AuthResult
          domain={record.auth_results.spf.domain}
          result={record.auth_results.spf.result}
        />
      </div>
    </div>
  </div>
</ReportCard>
