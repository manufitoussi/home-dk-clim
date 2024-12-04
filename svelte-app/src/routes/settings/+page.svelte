<script lang="ts">
	import { Heading, Label, Input, Button } from 'flowbite-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { settings, model } = data
</script>

<Heading>Settings</Heading>

<div>
	<Label for="title" class="mb-2">Title</Label>
	<Input
		type="text"
		id="title"
		placeholder="Title"
		required
		bind:value={model.title}
		autocorrect="off"
	/>
	<Button
		onclick={() => {
			settings.save();
		}}>Submit</Button
	>
</div>
