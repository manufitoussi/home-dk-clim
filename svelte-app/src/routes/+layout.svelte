<script lang="ts">
  import '../app.css';

  import { page } from '$app/state';
  import ConditionMode from '$lib/components/ConditionMode.svelte';
  import NavButton from '$lib/components/NavButton.svelte';
  import { Button, Dropdown, DropdownItem, Tooltip } from 'flowbite-svelte';
  import { ChevronUpOutline } from 'flowbite-svelte-icons';
  import { ArrowBigLeft, Power, Settings2 } from 'lucide-svelte';
  import { _ } from 'svelte-i18n';
  import { fade, fly } from 'svelte/transition';
  import type { ModeName } from '$lib';

  let { children, data } = $props();

  let activeUrl = $derived(page.url.pathname);
  let dropdownIconOpen = $state(false);

  const { settings, daikinService } = data;
  let currentMode = $derived(daikinService.currentMode);
  let outsideConditionMode = $derived<ModeName>(
    currentMode === 'cool' ? 'heat' : 'cool',
  );

  const onChangeMode = async (mode: ModeName) => {
    await daikinService.changeMode(mode);
    console.log(`Current mode updated to: ${currentMode}`); // Log the updated mode
  };
</script>

{#snippet conditionModeIconComponent(mode: ModeName)}
  <div in:fade>
    <ConditionMode
      {mode}
      className="text-{mode === 'cool' ? 'blue' : 'red'}-500 h-5 w-5"
    />
  </div>
{/snippet}

<div
  in:fade|global
  class="flex h-screen w-full flex-1 flex-col overflow-hidden bg-white"
>
  <!-- #216dcb -->
  <div class="flex items-center gap-1 bg-slate-700 p-2 text-white">
    {#if activeUrl === '/settings'}
      <div in:fly={{ x: '100%' }} class="flex flex-1 items-center gap-1">
        <NavButton href="/"><ArrowBigLeft /></NavButton>
        <div class="flex items-center gap-1 text-2xl font-semibold">
          <Settings2 />
          {$_('settings.page-title')}
        </div>
      </div>
    {:else}
      <div in:fly={{ x: '-100%' }} class="flex flex-1 items-center gap-1">
        <img src="/icon.png" alt="logo" class="h-6 w-6" />
        <span class="self-center whitespace-nowrap text-2xl font-semibold">
          {settings.title || $_('main.default-app-title')}</span
        >

        <div class="flex-1"></div>

        <div class="flex items-center gap-1 text-xl">
          <ConditionMode mode={outsideConditionMode} />
          <div class="mx-3 flex items-center gap-1 text-2xl font-semibold">
            <span class="font-bold">{daikinService.outdoorTemperature}</span
            ><span class="align-top text-sm">°C</span>
          </div>
        </div>
        <Tooltip class="z-50">{$_('main.outdoor-temperature')}</Tooltip>

        <NavButton href="/settings"><Settings2 /></NavButton>
        <Tooltip class="z-50">{$_('settings.page-title')}</Tooltip>
      </div>
    {/if}
  </div>

  {@render children()}

  {#if activeUrl !== '/settings'}
    <div
      in:fly|global={{ y: '100%', delay: 1000 }} out:fly|global={{ y: '100%' }}
      class="absolute bottom-2 right-2 flex items-center gap-2 overflow-visible"
    >
      {daikinService.devices.filter((d) => d.isOn).length} / {daikinService
        .devices.length}
      <Button
        pill
        outline
        class="p-2 text-white shadow-xl {daikinService.isSomeOn
          ? 'border-green-400 bg-green-500  hover:border-gray-400 hover:bg-gray-500'
          : 'border-gray-400 bg-gray-500 hover:border-green-400 hover:bg-green-500'}"
        size="xs"
        onclick={() =>
          daikinService.isSomeOn
            ? daikinService.switchOffAll()
            : daikinService.switchOnAll()}
      >
        <Power class="h-5 w-5 font-bold" strokeWidth="2" />
      </Button>
      <Tooltip color={daikinService.isSomeOn ? 'gray' : 'green'} class="z-50"
        >{$_(
          daikinService.isSomeOn ? 'main.all-switch-off' : 'main.all-switch-on',
        )}</Tooltip
      >
      <Button
        id="mode-toggle"
        outline
        pill
        size="xs"
        color="light"
        class="p-2 shadow-xl"
      >
        {#if currentMode}
          {@render conditionModeIconComponent(currentMode)}
        {:else}
          <div class="h-5 w-5"></div>
        {/if}
        <ChevronUpOutline class="ms-2 h-5 w-5" />
      </Button>
      <Dropdown bind:open={dropdownIconOpen}>
        {#each ['cool', 'heat'] as mode}
          <DropdownItem
            class="flex items-center gap-2 {mode === currentMode
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}"
            onclick={() => {
              // Handle mode selection
              dropdownIconOpen = false; // Close the dropdown after selection
              // Additional logic for mode selection can be added here
              onChangeMode(mode as ModeName);
            }}
          >
            {@render conditionModeIconComponent(mode as ModeName)}
            <span class="whitespace-nowrap text-sm"
              >{$_(`main.${mode}-mode`)}</span
            >
          </DropdownItem>
        {/each}
      </Dropdown>
      {#if !dropdownIconOpen}
        <Tooltip triggeredBy="#mode-toggle" class="z-50 whitespace-nowrap"
          >{$_(`main.${currentMode}-mode`)}</Tooltip
        >
      {/if}
    </div>
  {/if}
</div>
