<script module lang="ts">
  export interface MangageDeviceProps {
    onSaveDevice: (device: DeviceModel) => void;
    onRemoveDevice: (device: DeviceModel) => void;
    onValidateIp: (ip: string) => Promise<boolean>;
  }
  export interface DeviceEditProps extends MangageDeviceProps {
    device: DeviceModel;
  }
</script>

<script lang="ts">
  import { debounce } from '$lib';
  import DeviceIcon, { ICONS } from '$lib/components/DeviceIcon.svelte';
  import type DeviceModel from '$lib/models/device.svelte';
  import { Button, Dropdown, DropdownItem, Input } from 'flowbite-svelte';
  import {
    ChevronDownOutline,
    FloppyDiskOutline,
    SortOutline,
    TrashBinOutline,
  } from 'flowbite-svelte-icons';
  import { _ } from 'svelte-i18n';
  import { slide } from 'svelte/transition';
  import DeviceValidStatus from './DeviceValidStatus.svelte';

  const {
    device,
    onSaveDevice,
    onRemoveDevice,
    onValidateIp,
  }: DeviceEditProps = $props();
  let dropdownIconOpen = $state(false);

  const onSaveDeviceDebounced = debounce(onSaveDevice);

  let isValid = $state(false);
</script>

{#snippet iconComponent(icon: string)}
  <DeviceIcon {icon} />
{/snippet}

<div
  in:slide={{ axis: 'y', duration: 250 }}
  out:slide={{ axis: 'y', duration: 250 }}
  id={device.id}
  class="group col-start-1 col-end-8 grid max-h-11 grid-cols-subgrid overflow-visible"
>
  <div class="contents">
    <Button outline size="xs" class="border-none" color="light">
      {@render iconComponent(device.icon)}
      <ChevronDownOutline class="ms-2 h-6 w-6" />
    </Button>
    <Dropdown class="col-start-2 col-end-3" bind:open={dropdownIconOpen}>
      {#each Object.keys(ICONS) as icon}
        <DropdownItem
          class="flex w-[7em] items-center gap-2"
          on:click={() => {
            device.icon = icon;
            dropdownIconOpen = false;
            onSaveDeviceDebounced(device);
          }}
        >
          {@render iconComponent(icon)}
        </DropdownItem>
      {/each}
    </Dropdown>
  </div>
  <Input
    type="text"
    id="name"
    placeholder="Device name"
    required
    bind:value={device.name}
    oninput={() => {
      onSaveDeviceDebounced(device);
    }}
    autocorrect="off"
  />

  <Input
    type="text"
    id="ip"
    placeholder="192.168.0.x"
    required
    bind:value={device.ip}
    oninput={async () => {
      onSaveDeviceDebounced(device);
      isValid = await onValidateIp(device.ip);
    }}
    autocorrect="off"
  />

  <DeviceValidStatus {device} {onValidateIp} />

  <Button
    class="ml-2 border-none"
    outline
    color="red"
    size="xs"
    onclick={() => {
      onRemoveDevice(device);
      setTimeout(() => {
        document.getElementById(device.id)?.remove();
      }, 200);
    }}
  >
    <TrashBinOutline />
  </Button>
  <div
    class="handle ml-2 flex cursor-grab items-center border-none text-black opacity-0 group-hover:opacity-100"
  >
    <SortOutline />
  </div>
  <div
    class="ml-2 flex items-center border-none {device.isDirty
      ? ''
      : 'invisible'}"
  >
    <FloppyDiskOutline />
  </div>
</div>
