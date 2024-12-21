<script lang="ts">
  import { debounce } from '$lib';
  import DeviceEdit, {
    type MangageDeviceProps,
  } from '$lib/components/DeviceEdit.svelte';
  import type SettingsModel from '$lib/models/settings.svelte';
  import { SortableList } from '@jhubbardsf/svelte-sortablejs';
  import { Button, Input, Label } from 'flowbite-svelte';
  import { FloppyDiskOutline, PlusOutline } from 'flowbite-svelte-icons';
  import { _ } from 'svelte-i18n';
  import { fly } from 'svelte/transition';

  interface Props extends MangageDeviceProps {
    settings: SettingsModel;
    onSaveTitle: () => void;
    onAddDevice: () => void;
    onSortDevices: (oldIndex: number, newIndex: number) => void;
    onValidateIp: (ip: string) => Promise<boolean>;
  }

  const {
    settings,
    onSaveTitle,
    onAddDevice,
    onSortDevices,
    onSaveDevice,
    onRemoveDevice,
    onValidateIp,
  }: Props = $props();

  const onSaveTitleDebounced = debounce(onSaveTitle);
</script>

<div in:fly={{ x: '100%' }} class="flex w-full flex-col p-6">
  <div class="m-6">
    <div class="flex items-center">
      <Label for="title" class="mr-2 block text-base font-bold"
        >{$_('settings.title.label')}</Label
      >
      <Input
        type="text"
        id="title"
        placeholder={$_('settings.title.description')}
        required
        class="min-w-[17em] max-w-[25em]"
        bind:value={settings.title}
        oninput={onSaveTitleDebounced}
        autocorrect="off"
      />
      <div class="ml-2 border-none {settings.isTitleDirty ? '' : 'invisible'}">
        <FloppyDiskOutline class="animate-bounce" />
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-lg font-bold">{$_('settings.devices')}</h2>
      <div
        class="grid grid-cols-[minmax(5em,_7em)_minmax(12em,_17em)_minmax(9em,_11em)_2em_3em_2em_3em] place-items-center gap-x-2"
      >
        <div class="font-bold">{$_('settings.device-edit.icon.label')}</div>
        <div class="font-bold">{$_('settings.device-edit.name.label')}</div>
        <div class="font-bold">{$_('settings.device-edit.ip.label')}</div>
        <div></div>
        <div>
          <Button
            outline
            size="xs"
            class="ml-2 border-none text-green-600 hover:bg-green-600 hover:text-white"
            onclick={onAddDevice}
          >
            <PlusOutline />
          </Button>
        </div>
        <div></div>
        <div></div>
        <SortableList
          class="col-span-7 grid grid-cols-subgrid gap-y-2"
          handle=".handle"
          onSort={(e) => {
            onSortDevices(e.oldIndex, e.newIndex);
          }}
        >
          {#each settings.devices as device (device.id)}
            <DeviceEdit
              {device}
              {onSaveDevice}
              {onRemoveDevice}
              {onValidateIp}
            />
          {/each}
        </SortableList>
      </div>
    </div>
  </div>
</div>
