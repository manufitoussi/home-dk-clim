<script lang="ts">
	import { lookupSettingsService } from '$lib';
	import type DeviceModel from '$lib/models/device.svelte';
	import { Button, Input } from 'flowbite-svelte';
	import { FloppyDiskOutline, SortOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { fly, slide  } from 'svelte/transition';
	interface Props {
		device: DeviceModel;
	}

	const { device }: Props = $props();
	const settingsService = lookupSettingsService();
</script>

<div
	in:slide={{ axis: 'y', duration: 250 }}
	out:slide={{ axis: 'y', duration: 250 }}
	class="col-start-1 col-end-6 grid grid-cols-subgrid overflow-visible"
>
	<div class="handle ml-2 flex cursor-grab items-center border-none text-gray-500">
		<SortOutline />
	</div>
	<Input
		type="text"
		id="ip"
		placeholder="192.168.0.x"
		required
		bind:value={device.ip}
		autocorrect="off"
	/>
	<Input
		type="text"
		id="name"
		placeholder="Device name"
		required
		bind:value={device.name}
		autocorrect="off"
	/>
	<Button
		class="ml-2 border-none {device.isDirty ? '' : 'invisible'}"
		outline
		size="xs"
		onclick={() => {
			settingsService.saveDevice(device);
		}}
	>
		<FloppyDiskOutline />
	</Button>
	<Button
		class="ml-2 border-none"
		outline
		color="red"
		size="xs"
		onclick={() => {
			settingsService.removeDevice(device);
		}}
	>
		<TrashBinOutline />
	</Button>
</div>
