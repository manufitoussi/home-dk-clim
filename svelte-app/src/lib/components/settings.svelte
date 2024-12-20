<script lang="ts">
	import { useSettingsService } from '$lib';
	import DeviceEdit from '$lib/components/DeviceEdit.svelte';
	import type SettingsModel from '$lib/models/settings.svelte';
	import { SortableList } from '@jhubbardsf/svelte-sortablejs';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { FloppyDiskOutline, PlusOutline } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	interface Props {
		settings: SettingsModel;
	}

	const { settings }: Props = $props();
	const settingsService = useSettingsService();
</script>

<div in:fly={{ x: '100%' }} class="flex w-full flex-col p-6">
	<div class="m-6">
		<div class="flex items-center">
			<Label for="title" class="mr-2 block">Title</Label>
			<Input
				type="text"
				id="title"
				placeholder="Title"
				required
				class="min-w-[17em] max-w-[25em]"
				bind:value={settings.title}
				autocorrect="off"
			/>
			<Button
				class="ml-2 border-none {settings.isTitleDirty ? '' : 'invisible'}"
				outline
				size="xs"
				onclick={() => {
					settingsService.saveTitle();
				}}
			>
				<FloppyDiskOutline />
			</Button>
		</div>

		<div class="mt-6">
			<h2 class="text-lg font-semibold">Devices</h2>
			<div
				class="grid grid-cols-[2em_minmax(9em,_11em)_minmax(12em,_17em)_minmax(5em,_7em)_3em_3em] place-items-center gap-x-2"
			>
				<div></div>
				<div class="font-bold">IP</div>
				<div class="font-bold">Name</div>
				<div class="font-bold">Icon</div>
				<div></div>
				<div>
					<Button
						outline
						size="xs"
						class="ml-2 border-none"
						onclick={() => {
							settingsService.addDevice();
						}}
					>
						<PlusOutline />
					</Button>
				</div>
				<SortableList
					class="col-span-6 grid grid-cols-subgrid gap-y-2"
					handle=".handle"
					onSort={(e) => {
						settingsService.sortDevices(e.oldIndex, e.newIndex);
					}}
				>
					{#each settings.devices as device (device.id)}
						<DeviceEdit {device} />
					{/each}
				</SortableList>
			</div>
		</div>
	</div>
</div>
