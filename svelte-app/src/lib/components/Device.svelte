<script lang="ts">
  import DeviceIcon from '$lib/components/DeviceIcon.svelte';
  import type DeviceModel from '$lib/models/device.svelte';
  import { Skeleton } from 'flowbite-svelte';
  import { fade } from 'svelte/transition';
  import DeviceValidStatus from './DeviceValidStatus.svelte';

  interface Props {
    device: DeviceModel;
    onValidateIp: (ip: string) => Promise<boolean>;
    onGetImage: (filePath: string) => Promise<string | null>;
  }

  let { device, onValidateIp, onGetImage }: Props = $props();
  let isValid = $state(false);
  let imagePreview = $state('');

  $effect(() => {
    if (device.picture) {
      onGetImage(device.picture).then((base64) => {
        if (base64) {
          imagePreview = base64;
        }
      });
    }
  });
</script>

<div
  in:fade|global={{ delay: 250 }}
  class="relative flex h-60 w-96 flex-col rounded border"
  style="background-image: url({imagePreview}); background-size: cover; background-position: center;"
>
  <div
    class="absolute inset-0 rounded bg-black opacity-50"
    style="display: {imagePreview ? 'block' : 'none'};"
  ></div>
  <div
    class="relative flex w-full gap-2 rounded rounded-b-none {imagePreview
      ? ''
      : 'bg-gray-600'} p-3 text-white"
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
