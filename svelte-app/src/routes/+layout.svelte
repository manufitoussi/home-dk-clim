<script lang="ts">
  import '../app.css';

  import { page } from '$app/state';
  import ConditionMode from '$lib/components/ConditionMode.svelte';
  import NavButton from '$lib/components/NavButton.svelte';
  import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { ArrowBigLeft, Settings2, PowerOff, Power } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  let { children, data } = $props();

  let activeUrl = $derived(page.url.pathname);
  let dropdownIconOpen = $state(false);
  let currentMode = $state<'cold' | 'hot'>('cold');
  let outsideConditionMode = $derived<'cold' | 'hot'>(
    currentMode === 'cold' ? 'hot' : 'cold',
  );

  const { settings, daikinService } = data;
</script>

{#snippet conditionModeIconComponent(mode: 'cold' | 'hot')}
  <ConditionMode
    {mode}
    className="text-{mode === 'cold' ? 'blue' : 'red'}-500 h-5 w-5"
  />
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
          <Settings2 /> Settings
        </div>
      </div>
    {:else}
      <div in:fly={{ x: '-100%' }} class="flex flex-1 items-center gap-1">
        <img src="/icon.png" alt="logo" class="w-6 h-6" />
        <span class="self-center whitespace-nowrap text-2xl font-semibold">
          Climatisation {settings.title}</span
        >

        <div class="flex-1"></div>

        <div class="flex items-center gap-1 text-xl">
          <ConditionMode mode={outsideConditionMode} />
          <div class="mx-3 flex items-center gap-1 text-2xl font-semibold">
            <span class="font-bold">{daikinService.outdoorTemperature}</span
            ><span class="align-top text-sm">°C</span>
          </div>
        </div>
        <NavButton href="/settings"><Settings2 /></NavButton>
      </div>
    {/if}
  </div>

  {@render children()}

  {#if activeUrl !== '/settings'}
    <div
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

      <Button outline pill size="xs" color="light" class="p-2 shadow-xl">
        {@render conditionModeIconComponent(currentMode)}
        <ChevronDownOutline class="ms-2 h-5 w-5" />
      </Button>
      <Dropdown bind:open={dropdownIconOpen}>
        {#each ['cold', 'hot'] as mode}
          <DropdownItem
            class="flex items-center gap-2"
            onclick={() => {
              // Handle mode selection
              dropdownIconOpen = false; // Close the dropdown after selection
              // Additional logic for mode selection can be added here
              currentMode = mode as 'cold' | 'hot'; // Update the current mode
              console.log(`Current mode updated to: ${currentMode}`); // Log the updated mode
            }}
          >
            {@render conditionModeIconComponent(mode as 'cold' | 'hot')} <span class="text-sm">{mode}</span>
          </DropdownItem>
        {/each}
      </Dropdown>
    </div>
  {/if}
</div>
