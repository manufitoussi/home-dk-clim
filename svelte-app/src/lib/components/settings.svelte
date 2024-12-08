<script lang="ts">
	import { lookupSettingsService } from '$lib';
	import type SettingsModel from '$lib/models/settings.svelte';
	import { Button, Heading, Input, Label } from 'flowbite-svelte';
	import { CogOutline, FloppyDiskOutline, PlusOutline } from 'flowbite-svelte-icons';
	import DeviceEdit from './device-edit.svelte';

	interface Props {
		settings: SettingsModel;
	}

	const { settings }: Props = $props();
	const settingsService = lookupSettingsService();
</script>

<Heading class="flex items-center space-x-4"><CogOutline class="size-10" /> Settings</Heading>

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
			class="ml-2"
			outline
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
				onclick={() => {
					settingsService.addDevice();
				}}><PlusOutline /></Button
			>
		</div>
	</div>
</div>
