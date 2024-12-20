<script lang="ts">
	import DeviceIcon from '$lib/components/DeviceIcon.svelte';
	import type DeviceModel from '$lib/models/device.svelte';
	import { Skeleton } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		device: DeviceModel;
	}

	const { device }: Props = $props();
</script>

<div in:fade|global={{ delay: 250 }} class="flex h-72 w-96 flex-col rounded border">
	<div class="flex w-full gap-2 rounded rounded-b-none bg-gray-600 p-3 text-white">
		<DeviceIcon icon={device.icon} />
		{device.name}
	</div>
	<Skeleton size="sm" divClass="p-2" />
</div>
