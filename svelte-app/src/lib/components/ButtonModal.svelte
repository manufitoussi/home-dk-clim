<script lang="ts">
  import { Button, Modal } from 'flowbite-svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    onSubmit?: () => void;
    onCancel?: () => void;
    onWillOpen?: () => void;
    onDidClose?: () => void;
    children?: Snippet<[any]> | undefined;
    headerContent?: Snippet<[any]> | undefined;
    modalContent?: Snippet<[any]> | undefined;
    isSubmitAccented?: boolean;
  }

  let {
    onSubmit,
    onCancel,
    onWillOpen,
    onDidClose,
    children,
    headerContent,
    modalContent,
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
</script>

<Button
  class=" bg-white/20 py-1 text-gray-700 hover:bg-white/50"
  size="xs"
  onclick={handleOpen}
>
  {@render children?.({})}
</Button>
<Modal
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
    <Button color={isSubmitAccented ? 'dark' : 'alternative'} size="xs" onclick={handleSubmit}>SUBMIT</Button>
    <Button color="alternative" size="xs" onclick={handleCancel}>CANCEL</Button>
  </div>
</Modal>
