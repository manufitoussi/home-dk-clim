<script module lang="ts">
  export interface MangageDeviceProps {
    onSaveDevice: (device: DeviceModel) => void;
    onRemoveDevice: (device: DeviceModel) => void;
    onValidateIp: (ip: string) => Promise<boolean>;
    onSaveImage: (
      base64: string,
      oldFilePath: string | null,
    ) => Promise<string | null>;
    onRemoveImage: (filePath: string) => Promise<boolean>;
    onGetImage: (filePath: string) => Promise<string | null>;
  }
  export interface DeviceEditProps extends MangageDeviceProps {
    device: DeviceModel;
  }
</script>

<script lang="ts">
  import { debounce } from '$lib';
  import DeviceIcon, { ICONS } from '$lib/components/DeviceIcon.svelte';
  import type DeviceModel from '$lib/models/device.svelte';
  import { Button, Dropdown, DropdownItem, Input, Tooltip } from 'flowbite-svelte';
  import {
    ChevronDownOutline,
    FloppyDiskOutline,
    SortOutline,
    TrashBinOutline,
    ImageOutline,
  } from 'flowbite-svelte-icons';
  import { _ } from 'svelte-i18n';
  import { slide } from 'svelte/transition';
  import DeviceValidStatus from './DeviceValidStatus.svelte';

  const {
    device,
    onSaveDevice,
    onRemoveDevice,
    onValidateIp,
    onSaveImage,
    onRemoveImage,
    onGetImage,
  }: DeviceEditProps = $props();
  let dropdownIconOpen = $state(false);

  const onSaveDeviceDebounced = debounce(onSaveDevice);

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

  const onFileSelected = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const filePath = await onSaveImage(base64, device.picture);
      if (filePath) {
        device.picture = filePath;
        imagePreview = base64;
        onSaveDeviceDebounced(device);
      }
    };
    reader.readAsDataURL(file);
  };

  const onRemovePicture = async () => {
    if (device.picture) {
      await onRemoveImage(device.picture);
      device.picture = '';
      imagePreview = '';
      onSaveDeviceDebounced(device);
    }
  };
</script>

{#snippet iconComponent(icon: string)}
  <DeviceIcon {icon} />
{/snippet}

<div
  in:slide={{ axis: 'y', duration: 250 }}
  out:slide={{ axis: 'y', duration: 250 }}
  id={device.id}
  class="group col-start-1 col-end-9 grid max-h-11 grid-cols-subgrid overflow-visible"
>
  <div class="contents">
    <Button outline size="xs" class="border-none" color="light">
      {@render iconComponent(device.icon)}
      <ChevronDownOutline class="ms-2 h-6 w-6" />
    </Button>
    <Dropdown class="col-start-2 col-end-3 flex" bind:open={dropdownIconOpen}>
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
    placeholder={$_('settings.device-edit.name.description')}
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
    }}
    autocorrect="off"
  />

  <div class="flex items-center justify-start">
    <input
      type="file"
      id="{device.id}-file-upload"
      class="hidden"
      onchange={onFileSelected}
      accept="image/*"
    />
    <Button
      outline
      size="xs"
      class="w-12 border-none"
      color="light"
      onclick={() =>
        document.getElementById(`${device.id}-file-upload`)?.click()}
    >
      {#if imagePreview}
        <div
          class="h-6 w-6 rounded bg-contain bg-center bg-no-repeat"
          style="background-image: url({imagePreview})"
        ></div>
      {:else}
        +<ImageOutline />
      {/if}
    </Button>
    <Tooltip class="whitespace-nowrap bg-gray-200 text-black">{$_('settings.device-edit.picture.choice')}</Tooltip>
    {#if imagePreview}
      <button
        class="rounded border-none px-2 opacity-0 hover:bg-gray-100 group-hover:opacity-100"
        onclick={onRemovePicture}
      >
        ×
      </button>
      <Tooltip class="whitespace-nowrap bg-gray-200 text-black">{$_('settings.device-edit.picture.remove')}</Tooltip>
    {/if}
  </div>

  <DeviceValidStatus {device} {onValidateIp} bind:isValid />

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
    <FloppyDiskOutline class="animate-bounce" />
  </div>
</div>
