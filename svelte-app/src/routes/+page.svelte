<script lang="ts">
	import Device from '$lib/components/Device.svelte';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const settings = data.settings;
</script>

<div
	in:fly={{ x: '-100%' }}
	class="flex flex-1 flex-wrap items-center justify-center gap-4 overflow-hidden overflow-y-auto p-4"
>
	{#each settings.devices as device (device.id)}
		<Device {device} />
	{/each}
</div>
