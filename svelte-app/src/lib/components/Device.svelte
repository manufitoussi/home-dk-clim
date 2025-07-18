<script lang="ts">
  import DeviceIcon from '$lib/components/DeviceIcon.svelte';
  import type DeviceModel from '$lib/models/device.svelte';
  import { fade } from 'svelte/transition';
  import DeviceValidStatus from './DeviceValidStatus.svelte';
  import { Thermometer } from 'lucide-svelte';

  interface Props {
    device: DeviceModel;
    onValidateIp: (ip: string) => Promise<boolean>;
    onGetImage: (filePath: string) => Promise<string | null>;
    onGetTemperatures: (
      ip: string,
    ) => Promise<{ indoorTemperature: number; outdoorTemperature: number }>;
  }

  let { device, onValidateIp, onGetImage, onGetTemperatures } = $props();
  let isValid = $state(false);
  let isInitializing = $state(true);
  let imagePreview = $state('');
  let indoorTemperature = $state('');
  let timeout = $state<ReturnType<typeof setTimeout> | null>(null);

  const autoRefreshData = async () => {
    const { indoorTemperature: newIndoorTemp } = await onGetTemperatures(
      device.ip,
    );
    console.log('Temperatures:', indoorTemperature);
    indoorTemperature = newIndoorTemp.toFixed(1);

    timeout = setTimeout(autoRefreshData, 5000);
  };

  $effect(() => {
    if (device.picture) {
      onGetImage(device.picture).then((base64: string) => {
        if (base64) {
          imagePreview = base64;
        }
      });
    }

    onValidateIp(device.ip).then((valid: boolean) => {
      isValid = valid;
      isInitializing = false;
      if (valid) {
        autoRefreshData();
      } else {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      }
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
  });
</script>

<div
  in:fade|global={{ delay: 250 }}
  class="relative flex h-60 w-96 flex-col rounded border shadow-xl"
  style="background-image: url({imagePreview}); background-size: cover; background-position: center;"
>
  <div
    class="absolute inset-0 rounded bg-black opacity-50"
    style="display: {imagePreview ? 'block' : 'none'};"
  ></div>
  <div
    class="relative flex w-full items-center gap-2 rounded rounded-b-none {imagePreview
      ? ''
      : 'bg-gray-600'} p-3 text-white"
  >
    <DeviceIcon icon={device.icon} />
    {device.name}
  </div>
  <div class="relative flex h-full items-center p-4 text-white">
    {#if isInitializing}
      <span class="text-gray-400">INITIALIZING...</span>
    {:else if isValid}
      <div class="flex items-center gap-2 ">
        <Thermometer size={46} />
        <span class="text-3xl font-bold">{indoorTemperature}</span>
      </div>
    {:else}
      <span class="text-red-500">INVALID DEVICE</span>
    {/if}
  </div>
  <div class="h-16"></div>
  <DeviceValidStatus
    className="absolute bottom-1 right-1 opacity-30 hover:opacity-100"
    {device}
    {onValidateIp}
    bind:isValid
  />
</div>
