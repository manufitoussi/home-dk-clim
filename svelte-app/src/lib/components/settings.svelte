<script lang="ts">
	import { lookupSettingsService } from '$lib';
	import { Button, Heading, Input, Label } from 'flowbite-svelte';

	const { settings } = $props();
	const settingsService = lookupSettingsService();
</script>

<Heading>Settings</Heading>

<div>
	<Label for="title" class="mb-2">Title</Label>
	<Input
		type="text"
		id="title"
		placeholder="Title"
		required
		bind:value={settings.title}
		autocorrect="off"
	/>
	<Button
		onclick={() => {
			settingsService.save();
		}}>Submit</Button
	>
</div>
