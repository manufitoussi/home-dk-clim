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
			<ul>
				{#each settings.devices as device}
					<li class="mb-2">
						<DeviceEdit {device} />
					</li>
				{/each}
			</ul>
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
