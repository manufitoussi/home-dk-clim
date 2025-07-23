<script lang="ts">
  import { type Dir, type Rate } from '$lib';
  import DeviceIcon from '$lib/components/DeviceIcon.svelte';
  import type DeviceModel from '$lib/models/device.svelte';
  import { Button, ButtonGroup, Range, Toggle, Tooltip } from 'flowbite-svelte';
  import {
    AirVent,
    ArrowDownUp,
    ArrowLeftRight,
    ArrowRightToLine,
    Ban,
    Expand,
    Icon as LucideIcon,
    Moon,
    Power,
    Rotate3D,
    SignalHigh,
    SignalLow,
    SignalMedium,
    Thermometer,
  } from 'lucide-svelte';
  import { _ } from 'svelte-i18n';
  import { fade, scale } from 'svelte/transition';
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
    onSwitchFlowDirection: (
      device: DeviceModel,
      flowDirection: Dir,
    ) => Promise<{ [key: string]: string } | null>;
    onSetTemperature: (
      device: DeviceModel,
      temperature: string,
    ) => Promise<{ [key: string]: string } | null>;
    onSwitchFlowRateAll: (
      flowRate: Rate,
    ) => Promise<Array<{ [key: string]: string } | null>>;
    onSwitchFlowDirectionAll: (
      flowDirection: Dir,
    ) => Promise<Array<{ [key: string]: string } | null>>;
    onSetTemperatureAll: (
      temperature: string,
    ) => Promise<Array<{ [key: string]: string } | null>>;
    onStartAutoRefresh: (device: DeviceModel) => Promise<void>;
    onStopAutoRefresh: (device: DeviceModel) => Promise<void>;
  }

  let {
    device,
    onValidateIp,
    onGetImage,
    onTogglePower,
    onSwitchFlowRate,
    onSwitchFlowDirection,
    onSetTemperature,
    onSwitchFlowRateAll,
    onSwitchFlowDirectionAll,
    onSetTemperatureAll,
    onStartAutoRefresh,
    onStopAutoRefresh,
  }: Props = $props();
  let isValid = $state(false);
  let isInitializing = $state(true);
  let imagePreview = $state('');
  let indoorTemperature = $derived(
    device.indoorTemperature ? device.indoorTemperature.toFixed(1) : '',
  );

  let flowDirectionCommand = $state<Dir>('0');
  let flowRateCommand = $state<Rate>(device.flowRate || 'A');
  let sTemperatureCommand = $state(device.sTemperature || 20);

  let minTemperature = $derived(device.currentMode === 'cool' ? 18 : 15);

  const maxTemperature = 30;

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

{#snippet flowDirectionIconComponent(airDirection: Dir)}
  {#if airDirection === '0'}
    <Ban size={16} />
  {:else if airDirection === '3'}
    <Rotate3D size={16} />
  {:else if airDirection === '1'}
    <ArrowDownUp size={16} />
  {:else if airDirection === '2'}
    <ArrowLeftRight size={16} />
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

{#snippet flowDirectionChoiceButton(direction: Dir)}
  <Button
    on:click={() => (flowDirectionCommand = direction)}
    color={flowDirectionCommand === direction ? 'dark' : 'light'}
  >
    {@render flowDirectionIconComponent(direction)}</Button
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
      <Tooltip
        transition={fade}
        params={{ duration: 100, delay: 300 }}
        class="z-50"
        >{$_(
          device.isOn ? 'main.device.switch-off' : 'main.device.switch-on',
        )}</Tooltip
      >
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
      <ButtonModal
        onWillOpen={() => {
          sTemperatureCommand = device.sTemperature!;
        }}
        onCancel={() => (sTemperatureCommand = device.sTemperature!)}
        onSubmit={() =>
          onSetTemperature(device, sTemperatureCommand.toFixed(1))}
        onSubmitAll={() => onSetTemperatureAll(sTemperatureCommand.toFixed(1))}
        isSubmitAccented={sTemperatureCommand !== device.sTemperature}
      >
        <div class="flex items-center">
          <ArrowRightToLine class="mr-2" size="16" />
          {device.sTemperature?.toFixed(1)}
          <span class="align-top">°C</span>
        </div>
        {#snippet buttonTooltipContent()}
          {$_('main.device.set-temperature')}
        {/snippet}
        {#snippet headerContent()}
          {@render headerTitleContent(
            device.name,
            ArrowRightToLine,
            `${sTemperatureCommand.toFixed(1)}°C`,
          )}
        {/snippet}
        {#snippet modalContent()}
          <div class="relative w-[400px]">
            {#if device.currentMode === 'heat'}
              <span
                class="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400"
                >15°C</span
              >
            {/if}
            <span
              style="inset-inline-start: {Math.round(
                (400.0 / (maxTemperature - minTemperature)) *
                  (20 - minTemperature),
              ) - (device.currentMode === 'cool' ? 10 : 13)}px;"
              class="pointer-events-none absolute -bottom-6 text-sm text-gray-500 dark:text-gray-400"
              >20°C <div
                class="absolute -top-5 start-1/2 h-3 w-1 -translate-x-1/2 border-r border-blue-500"
              ></div>
            </span>
            <span
              style="inset-inline-start: {Math.round(
                (400.0 / (maxTemperature - minTemperature)) *
                  (25 - minTemperature),
              ) - (device.currentMode === 'cool' ? 17 : 20)}px;"
              class="pointer-events-none absolute -bottom-6 text-sm text-gray-500 rtl:translate-x-1/2 dark:text-gray-400"
              >25°C <div
                class="absolute -top-5 start-1/2 h-3 w-1 -translate-x-1/2 border-r border-blue-500"
              ></div>
            </span>
            <span
              class="pointer-events-none absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400"
              >30°C</span
            >
            <Range
              min={minTemperature}
              max={maxTemperature}
              step={0.5}
              color={device.currentMode === 'cool' ? 'blue' : 'red'}
              bind:value={sTemperatureCommand}
              class="w-fill"
            />
          </div>
        {/snippet}
      </ButtonModal>
      <ButtonModal
        onWillOpen={() => {
          flowRateCommand = device.flowRate || 'A';
        }}
        onSubmit={() => onSwitchFlowRate(device, flowRateCommand)}
        onSubmitAll={() => onSwitchFlowRateAll(flowRateCommand)}
        onCancel={() => (flowRateCommand = device.flowRate || 'A')}
        isSubmitAccented={flowRateCommand !== device.flowRate}
      >
        <div class="flex items-center">
          <AirVent class="mr-2" size="16" />
          {@render flowRateIconComponent(device.flowRate)}
        </div>
        {#snippet buttonTooltipContent()}
          {$_('main.device.switch-flow-rate')}
        {/snippet}
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
      <ButtonModal
        onWillOpen={() => {
          flowDirectionCommand = device.flowDirection || '0';
        }}
        onSubmit={() => onSwitchFlowDirection(device, flowDirectionCommand)}
        onSubmitAll={() => onSwitchFlowDirectionAll(flowDirectionCommand)}
        onCancel={() => (flowDirectionCommand = device.flowDirection || '0')}
        isSubmitAccented={flowDirectionCommand !== device.flowDirection}
      >
        <div class="flex items-center">
          <Expand class="mr-2" size="16" />
          {@render flowDirectionIconComponent(device.flowDirection)}
        </div>
        {#snippet buttonTooltipContent()}
          {$_('main.device.switch-flow-direction')}
        {/snippet}
        {#snippet headerContent()}
          {@render headerTitleContent(device.name, Expand, 'FLOW DIRECTION')}
        {/snippet}
        {#snippet modalContent()}
          <ButtonGroup>
            {@render flowDirectionChoiceButton('0')}
            {@render flowDirectionChoiceButton('1')}
            {@render flowDirectionChoiceButton('2')}
            {@render flowDirectionChoiceButton('3')}
          </ButtonGroup>
        {/snippet}
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
