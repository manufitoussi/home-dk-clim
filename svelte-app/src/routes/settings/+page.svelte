<script lang="ts">
	import Settings from '$lib/components/Settings.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { settings } = data;
</script>

<Settings {settings} />
