<script lang="ts">
  export let title: string
</script>

<div class="grid gap-2 rounded-md border border-white/50 bg-white/50 p-2">
  <p class="text-sm font-bold text-slate-500">{title}</p>
  <slot />
</div>
