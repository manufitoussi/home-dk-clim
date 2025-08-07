<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    Modal,
    Tooltip,
  } from 'flowbite-svelte';
  import { Check, CheckCheck, ChevronDown } from 'lucide-svelte';
  import type { Snippet } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { fade, slide } from 'svelte/transition';

  interface Props {
    onSubmit?: () => void;
    onSubmitAll?: () => void;
    onCancel?: () => void;
    onWillOpen?: () => void;
    onDidClose?: () => void;
    children?: Snippet<[any]> | undefined;
    headerContent?: Snippet<[any]> | undefined;
    modalContent?: Snippet<[any]> | undefined;
    buttonTooltipContent?: Snippet<[any]> | undefined;
    isSubmitAccented?: boolean;
  }

  let {
    onSubmit,
    onSubmitAll,
    onCancel,
    onWillOpen,
    onDidClose,
    children,
    headerContent,
    modalContent,
    buttonTooltipContent,
    isSubmitAccented = false,
  }: Props = $props();
  let isOpened = $state(false);

  function handleOpen() {
    onWillOpen?.();
    isOpened = true;
  }

  function handleCancel() {
    isOpened = false;
    onCancel?.();
  }

  function handleSubmit() {
    onSubmit?.();
    isOpened = false;
  }

  function handleSubmitAll() {
    onSubmitAll?.();
    isOpened = false;
  }

  const uniqId = `tt_${Math.random().toString(36).substring(2, 15)}`;
</script>

<Button
  id={uniqId}
  class=" bg-white/20 shadow-md hover:shadow-lg shadow-gray-500 py-1 text-gray-700 hover:bg-white/50"
  size="xs"
  onclick={handleOpen}
>
  {@render children?.({})}
</Button>
<Modal
  transition={slide}
  outsideclose
  bind:open={isOpened}
  onclose={() => {
    onDidClose?.();
  }}
  class="w-fit divide-none"
  classHeader="h-12 font-bold"
  classFooter="h-16 md:p-3 space-x-0"
  bodyClass="p-3"
>
  <div slot="header" class="flex items-center gap-2 text-sm font-bold">
    {@render headerContent?.({})}
  </div>
  <div class="flex justify-center">
    {@render modalContent?.({})}
  </div>
  <div
    slot="footer"
    class="m-0 flex w-full flex-row-reverse content-end items-end gap-2 p-0"
  >
    <ButtonGroup>
      <Button
        color={isSubmitAccented ? 'primary' : 'alternative'}
        disabled={!isSubmitAccented}
        size="xs"
        onclick={handleSubmit}><Check size={16} /> {$_('common.submit')}</Button
      >
      <Button class="ml-[1px] !rounded-e-lg" color="alternative" size="xs"
        ><ChevronDown size={16} /></Button
      >
      <Dropdown
        class="border-none bg-transparent p-0 shadow-md"
        classContainer="bg-transparent"
      >
        <DropdownItem
          class="flex items-center gap-2 whitespace-nowrap rounded-lg border-gray-600 bg-white text-xs font-normal text-gray-600 hover:bg-gray-100"
          onclick={handleSubmitAll}
          ><CheckCheck size={16} /> {$_('common.submit-all')}</DropdownItem
        >
      </Dropdown>
    </ButtonGroup>
    <!-- <Button color="light" size="xs" onclick={handleCancel}>{$_('common.cancel')}</Button> -->
  </div>
</Modal>

{#if buttonTooltipContent}
  <Tooltip
    transition={fade}
    params={{ duration: 100, delay: 100 }}
    class="z-200 whitespace-nowrap bg-gray-200 text-black"
    triggeredBy={`#${uniqId}`}
  >
    {@render buttonTooltipContent?.({})}
  </Tooltip>
{/if}
