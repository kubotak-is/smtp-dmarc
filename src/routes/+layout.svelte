<script>
  import '../app.pcss'
  import { initializeStores } from '@skeletonlabs/skeleton'
  import { MetaTags } from 'svelte-meta-tags'
  import { page } from '$app/stores'

  $: metaTags = {
    titleTemplate: '%s | STMP DMARC', // Default title template.
    description: 'Tool to visualize DMARC reports using SMTP', // Default description.
    ...$page.data.metaTagsChild // Override with child page meta tags if they exist.
  }

  initializeStores()
</script>

<MetaTags {...metaTags} />

<slot />
