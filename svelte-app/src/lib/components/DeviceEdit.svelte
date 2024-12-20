<script lang="ts">
	import { useSettingsService } from '$lib';
	import DeviceIcon, { ICONS } from '$lib/components/DeviceIcon.svelte';
	import type DeviceModel from '$lib/models/device.svelte';
	import { Button, Dropdown, DropdownItem, Input } from 'flowbite-svelte';
	import {
		ChevronDownOutline,
		FloppyDiskOutline,
		SortOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';

	interface Props {
		device: DeviceModel;
	}

	const { device }: Props = $props();
	const settingsService = useSettingsService();
	let dropdownIconOpen = $state(false);
</script>

{#snippet iconComponent(icon: string)}
	<DeviceIcon {icon} />
{/snippet}

<div
	in:slide={{ axis: 'y', duration: 250 }}
	out:slide={{ axis: 'y', duration: 250 }}
	class="col-start-1 col-end-7 grid grid-cols-subgrid overflow-visible"
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

	<div class="contents">
		<Button outline size="xs" class="border-none" color="light">
			{@render iconComponent(device.icon)}
			<ChevronDownOutline class="ms-2 h-6 w-6" />
		</Button>
		<Dropdown class="col-start-2 col-end-3" bind:open={dropdownIconOpen}>
			{#each Object.keys(ICONS) as icon}
				<DropdownItem
					class="flex w-[7em] items-center gap-2"
					on:click={() => {
						device.icon = icon;
						dropdownIconOpen = false;
					}}
				>
					{@render iconComponent(icon)}
				</DropdownItem>
			{/each}
		</Dropdown>
	</div>

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
