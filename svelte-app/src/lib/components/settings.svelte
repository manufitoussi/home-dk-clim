<script lang="ts">
	import { lookupSettingsService } from '$lib';
	import type SettingsModel from '$lib/models/settings.svelte';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { CogOutline, FloppyDiskOutline, PlusOutline } from 'flowbite-svelte-icons';
	import DeviceEdit from './device-edit.svelte';

	interface Props {
		settings: SettingsModel;
	}

	const { settings }: Props = $props();
	const settingsService = lookupSettingsService();
</script>

<div class="flex w-full flex-col p-6">
	<h2 class="flex w-full items-center"><CogOutline class="size-10 space-x-4" /> Settings</h2>

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
			<div class="grid grid-cols-[minmax(9em,_11em)_minmax(12em,_17em)_3em_3em] place-items-center gap-2">
				<div>IP</div><div>Name</div><div></div><div></div>
				{#each settings.devices as device}
					<DeviceEdit {device} />
				{/each}
			</div>
			<div>
				<Button
					outline
					size="xs"
					class="border-none"
					onclick={() => {
						settingsService.addDevice();
					}}
				>
					<PlusOutline />
				</Button>
			</div>
		</div>
	</div>
</div>
