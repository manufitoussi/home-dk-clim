<script lang="ts">
  import Settings from '$lib/components/Settings.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<Settings {...data} />
