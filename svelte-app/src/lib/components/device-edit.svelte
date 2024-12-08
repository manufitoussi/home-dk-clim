<script lang="ts">
	import { lookupSettingsService } from '$lib';
	import type DeviceModel from '$lib/models/device.svelte';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { FloppyDiskOutline, TrashBinOutline } from 'flowbite-svelte-icons';

	interface Props {
		device: DeviceModel;
	}

	const { device }: Props = $props();
	const settingsService = lookupSettingsService();
</script>

<div class="flex items-center">
  <Label for="ip" class="mr-2 block">IP</Label>
  <Input
    type="text"
    id="ip"
    placeholder="192.168.0.x"
    required
    bind:value={device.ip}
    autocorrect="off"
  />
  <Label for="name" class="ml-5 mr-2 block">Name</Label>
  <Input
    type="text"
    id="name"
    placeholder="Device name"
    required
    bind:value={device.name}
    autocorrect="off"
  />
  <Button
    class="ml-2"
    outline
    size="xs"
    onclick={() => {
      settingsService.saveDevice(device);
    }}
  >
    <FloppyDiskOutline />
  </Button>
	<Button class="ml-2" outline color="red" size="xs"
		onclick={() => {
			settingsService.removeDevice(device);
		}}><TrashBinOutline /></Button
	>
</div>
