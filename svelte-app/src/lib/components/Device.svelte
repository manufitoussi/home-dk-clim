<script lang="ts">
  import DeviceIcon from '$lib/components/DeviceIcon.svelte';
  import type DeviceModel from '$lib/models/device.svelte';
  import { Skeleton } from 'flowbite-svelte';
  import { fade } from 'svelte/transition';
  import DeviceValidStatus from './DeviceValidStatus.svelte';

  interface Props {
    device: DeviceModel;
    onValidateIp: (ip: string) => Promise<boolean>;
  }

  let { device, onValidateIp }: Props = $props();
  let isValid = $state(false);
</script>

<div
  in:fade|global={{ delay: 250 }}
  class="relative flex h-60 w-96 flex-col rounded border"
>
  <div
    class="flex w-full gap-2 rounded rounded-b-none bg-gray-600 p-3 text-white"
  >
    <DeviceIcon icon={device.icon} />
    {device.name}
  </div>
  <Skeleton size="sm" divClass="p-2" />
  <DeviceValidStatus
    className="absolute bottom-1 right-1 opacity-30 hover:opacity-100"
    {device}
    {onValidateIp}
    bind:isValid
  />
</div>
