<script lang="ts">
  import { debounce } from '$lib';
  import { Spinner, Tooltip } from 'flowbite-svelte';
  import { Check, TriangleAlert, XIcon } from 'lucide-svelte';
  import { _ } from 'svelte-i18n';

  interface Props {
    device: { ip: string };
    onValidateIp: (ip: string) => Promise<boolean>;
    isValid?: boolean;
    className?: string;
  }

  let {
    device,
    onValidateIp,
    isValid = $bindable(false),
    className = '',
    ...others
  }: Props = $props();

  const validate = async (ip: string) => {
    isValid = await onValidateIp(ip);
    return isValid;
  };

  const onValidateIpDebounced = debounce(validate);
</script>

<div class="flex items-center justify-items-center {className}" {...others}>
  {#await onValidateIpDebounced(device.ip)}
    <Spinner size={5} />
    <Tooltip>{$_('settings.device-looking-for')}</Tooltip>
  {:then}
    {#if isValid}
      <Check color="green" />
      <Tooltip>{$_('settings.device-found')}</Tooltip>
    {:else}
      <XIcon color="orange" />
      <Tooltip>{$_('settings.device-not-found')}</Tooltip>
    {/if}
  {:catch error}
    <TriangleAlert color="red" />
    <Tooltip>{error.message || error}</Tooltip>
  {/await}
</div>
