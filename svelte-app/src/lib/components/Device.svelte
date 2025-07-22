<script lang="ts">
  import type { Dir, Rate } from '$lib';
  import DeviceIcon from '$lib/components/DeviceIcon.svelte';
  import type DeviceModel from '$lib/models/device.svelte';
  import { Button, ButtonGroup, Toggle } from 'flowbite-svelte';
  import {
    AirVent,
    ArrowRightToLine,
    Ban,
    Expand,
    Icon as LucideIcon,
    Moon,
    MoveHorizontal,
    MoveVertical,
    Power,
    Rotate3D,
    SignalHigh,
    SignalLow,
    SignalMedium,
    Thermometer,
  } from 'lucide-svelte';
  import { _ } from 'svelte-i18n';
  import { scale } from 'svelte/transition';
  import ButtonModal from './ButtonModal.svelte';
  import DeviceValidStatus from './DeviceValidStatus.svelte';

  interface Props {
    device: DeviceModel;
    onValidateIp: (ip: string) => Promise<boolean>;
    onGetImage: (filePath: string) => Promise<string | null>;
    onTogglePower: (
      device: DeviceModel,
    ) => Promise<{ [key: string]: string } | null>;
    onSwitchFlowRate: (
      device: DeviceModel,
      flowRate: Rate,
    ) => Promise<{ [key: string]: string } | null>;
    onStartAutoRefresh: (device: DeviceModel) => Promise<void>;
    onStopAutoRefresh: (device: DeviceModel) => Promise<void>;
  }

  let {
    device,
    onValidateIp,
    onGetImage,
    onTogglePower,
    onSwitchFlowRate,
    onStartAutoRefresh,
    onStopAutoRefresh,
  }: Props = $props();
  let isValid = $state(false);
  let isInitializing = $state(true);
  let imagePreview = $state('');
  let indoorTemperature = $derived(
    device.indoorTemperature ? device.indoorTemperature.toFixed(1) : '',
  );

  let dir = $state<Dir>('0');

  let flowRateCommand = $state<Rate>(device.flowRate || 'A');

  $effect(() => {
    if (device.picture) {
      onGetImage(device.picture).then((base64: string | null) => {
        if (base64) {
          imagePreview = base64;
        }
      });
    }

    onValidateIp(device.ip).then((valid: boolean) => {
      isValid = valid;
      isInitializing = false;
      if (valid) {
        onStartAutoRefresh(device);
      } else {
        onStopAutoRefresh(device);
      }
    });

    return () => {
      onStopAutoRefresh(device);
    };
  });
</script>

{#snippet flowRateIconComponent(airFlow: Rate)}
  {#if airFlow === 'A'}
    <span>Auto</span>
  {:else if airFlow === 'B'}
    <Moon size={16} />
  {:else if airFlow === '3'}
    <span>Min</span>
  {:else if airFlow === '4'}
    <SignalLow size={16} />
  {:else if airFlow === '5'}
    <SignalMedium size={16} />
  {:else if airFlow === '6'}
    <SignalHigh size={16} />
  {:else if airFlow === '7'}
    <span>Max</span>
  {/if}
{/snippet}

{#snippet airDirectionIconComponent(airDirection: Dir)}
  {#if airDirection === '0'}
    <Ban size={16} />
  {:else if airDirection === '3'}
    <Rotate3D size={16} />
  {:else if airDirection === '1'}
    <MoveVertical size={16} />
  {:else if airDirection === '2'}
    <MoveHorizontal size={16} />
  {/if}
{/snippet}

{#snippet headerTitleContent(
  name: string,
  Icon: typeof LucideIcon,
  field: string,
)}
  <div class="flex items-center gap-1">
    {name}
    <!-- svelte-ignore svelte_component_deprecated -->
    <svelte:component this={Icon} size={16} />
    {field}
  </div>
{/snippet}

{#snippet flowRateChoiceButton(rate: Rate)}
  <Button
    on:click={() => (flowRateCommand = rate)}
    color={flowRateCommand === rate ? 'dark' : 'light'}
  >
    {@render flowRateIconComponent(rate)}</Button
  >
{/snippet}

<div
  in:scale|global={{ delay: 500, duration: 800 }}
  class="relative flex h-60 w-96 flex-col overflow-hidden rounded-lg border border-gray-200 shadow-xl"
>
  {#if imagePreview}
    <div
      class="absolute inset-0 transition-[filter] duration-700 {device.isOn
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
        checked={device.isOn}
        on:change={() => onTogglePower(device)}
        color="green"
      >
        {#if false}
          <div class="relative">
            <Power
              class="absolute inset-0 h-5 w-5 font-bold blur-sm {device.isOn
                ? 'text-green-500 group-hover:invisible'
                : 'invisible group-hover:visible group-hover:text-green-300'}"
              strokeWidth="3"
            />
            <Power
              class="h-5 w-5 font-bold {device.isOn
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
      <span class="text-gray-400">{$_('main.device.initializing')}</span>
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
      <span class="text-red-500">{$_('main.device.not-found')}</span>
    {/if}
  </div>
  <div class="relative m-auto flex h-16 gap-3 p-2 text-gray-700">
    {#if isValid}
      <ButtonModal>
        <div class="flex items-center">
          <ArrowRightToLine class="mr-2" size="16" />
          {device.sTemperature?.toFixed(1)}
          <span class="align-top">°C</span>
        </div>
      </ButtonModal>
      <ButtonModal onSubmit={() => onSwitchFlowRate(device, flowRateCommand)}>
        <div class="flex items-center">
          <AirVent class="mr-2" size="16" />
          {@render flowRateIconComponent(device.flowRate)}
        </div>
        {#snippet headerContent()}
          {@render headerTitleContent(device.name, AirVent, 'FLOW RATE')}
        {/snippet}
        {#snippet modalContent()}
          <ButtonGroup>
            {@render flowRateChoiceButton('A')}
            {@render flowRateChoiceButton('B')}
            {@render flowRateChoiceButton('3')}
            {@render flowRateChoiceButton('4')}
            {@render flowRateChoiceButton('5')}
            {@render flowRateChoiceButton('6')}
            {@render flowRateChoiceButton('7')}
          </ButtonGroup>
        {/snippet}
      </ButtonModal>
      <ButtonModal>
        <div class="flex items-center">
          <Expand class="mr-2" size="16" />
          {@render airDirectionIconComponent(device.flowDirection)}
        </div>
      </ButtonModal>
    {/if}
  </div>
  <DeviceValidStatus
    className="absolute top-3 right-1 {isValid ? 'opacity-0' : 'opacity-100'}"
    {device}
    {onValidateIp}
    bind:isValid
  />
</div>
