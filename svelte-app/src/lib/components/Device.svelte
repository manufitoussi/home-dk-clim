<script lang="ts">
  import type { Dir, Pow, Rate, ControlInfo } from '$lib';
  import DeviceIcon from '$lib/components/DeviceIcon.svelte';
  import type DeviceModel from '$lib/models/device.svelte';
  import { Toggle } from 'flowbite-svelte';
  import { Thermometer, Power } from 'lucide-svelte';
  import { scale } from 'svelte/transition';
  import DeviceValidStatus from './DeviceValidStatus.svelte';
  interface Props {
    device: DeviceModel;
    onValidateIp: (ip: string) => Promise<boolean>;
    onGetImage: (filePath: string) => Promise<string | null>;
    onGetTemperatures: (
      ip: string,
    ) => Promise<{ indoorTemperature: number; outdoorTemperature: number }>;
    onGetControlInfo?: (ip: string) => Promise<ControlInfo>;
    onSetControlInfo?: (
      ip: string,
      controls: { [key: string]: string },
    ) => Promise<ControlInfo>;
  }

  const isActiveFromPow = (pow: Pow) => {
    return Boolean(parseFloat(pow));
  };

  const powFromIsActive = (isActive: boolean): Pow => {
    return isActive ? '1' : '0';
  };

  let {
    device,
    onValidateIp,
    onGetImage,
    onGetTemperatures,
    onGetControlInfo,
    onSetControlInfo,
  } = $props();
  let isValid = $state(false);
  let isInitializing = $state(true);
  let imagePreview = $state('');
  let indoorTemperature = $state('');
  let timeout = $state<ReturnType<typeof setTimeout> | null>(null);

  let isActive = $derived(isActiveFromPow(device.controlInfo?.pow || '0'));
  let dir = $state<Dir>('0');
  let rate = $state<Rate>('A');

  const autoRefreshData = async () => {
    const { indoorTemperature: newIndoorTemp } = await onGetTemperatures(
      device.ip,
    );
    console.log('Temperatures:', indoorTemperature);
    indoorTemperature = newIndoorTemp.toFixed(1);

    await onGetControlInfo?.(device.ip);

    timeout = setTimeout(autoRefreshData, 5000);
  };

  const switchActive = async () => {
    const newPow: Pow = powFromIsActive(!isActive);
    device.controlInfo.pow = newPow;
    const result = await onSetControlInfo?.(device.ip, device.controlInfo);
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
  in:scale|global={{ delay: 500, duration: 800 }}
  class="relative flex h-60 w-96 flex-col overflow-hidden rounded-lg border border-gray-200 shadow-xl"
>
  {#if imagePreview}
    <div
      class="absolute inset-0 transition-[filter] duration-700 {isActive
        ? 'saturate-100'
        : 'saturate-0'}"
      style="background-image: url({imagePreview}); background-size: cover; background-position: center;"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-100"
      style=""
    ></div>
  {/if}
  <div
    class="border-bottom relative flex w-full items-center gap-2 {imagePreview
      ? 'bg-white/50 backdrop-blur-sm'
      : 'bg-gray-600 text-white'} p-3"
  >
    <DeviceIcon icon={device.icon} />
    {device.name}
    {#if isValid}
      <Toggle
        class="group ms-auto"
        checked={isActive}
        on:change={switchActive}
        color="green"
      >
        {#if false}
          <div class="relative">
            <Power
              class="absolute inset-0 h-5 w-5 font-bold blur-sm {isActive
                ? 'text-green-500 group-hover:invisible'
                : 'invisible group-hover:visible group-hover:text-green-300'}"
              strokeWidth="3"
            />
            <Power
              class="h-5 w-5 font-bold {isActive
                ? 'text-green-500 group-hover:text-gray-500'
                : 'text-gray-500 group-hover:text-green-500'}"
              strokeWidth="2"
            />
          </div>
        {/if}
      </Toggle>
    {/if}
  </div>
  <div class="relative flex h-full items-center p-4 text-gray-700">
    {#if isInitializing}
      <span class="text-gray-400">INITIALIZING...</span>
    {:else if isValid}
      <div class="flex items-center gap-1">
        <Thermometer size={46} />
        <div class="flex">
          <span class="text-3xl font-bold">{indoorTemperature}</span><span
            class="mt-1 self-start text-base">°C</span
          >
        </div>
      </div>
    {:else}
      <span class="text-red-500">INVALID DEVICE</span>
    {/if}
  </div>
  <div class="h-16"></div>
  <DeviceValidStatus
    className="absolute top-3 right-1 {isValid ? 'opacity-0' : 'opacity-100'}"
    {device}
    {onValidateIp}
    bind:isValid
  />
</div>
