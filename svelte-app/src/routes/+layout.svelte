<script lang="ts">
  import '../app.css';

  import { page } from '$app/state';
  import ConditionMode from '$lib/components/ConditionMode.svelte';
  import NavButton from '$lib/components/NavButton.svelte';
  import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { ArrowBigLeft, RefreshCcw, Settings2 } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  
  let { children, data } = $props();
  
  let activeUrl = $derived(page.url.pathname);
  let dropdownIconOpen = $state(false);
  let currentMode = $state<'cold' | 'hot'>('cold');
  let outsideConditionMode = $derived<'cold' | 'hot'>(currentMode === 'cold' ? 'hot' : 'cold');

  const { settings } = data;
</script>

{#snippet conditionModeIconComponent(mode: 'cold' | 'hot')}
  <ConditionMode {mode} className="text-{mode === 'cold' ? 'blue' : 'red'}-500" />
{/snippet}

<div in:fade|global class="flex h-screen w-full flex-1 flex-col overflow-hidden bg-white">
  <div class="flex items-center gap-1 bg-[#216dcb] p-2 text-white">
    {#if activeUrl === '/settings'}
      <div in:fly={{ x: '100%' }} class="flex flex-1 items-center gap-1">
        <NavButton href="/"><ArrowBigLeft /></NavButton>
        <div class="flex items-center gap-1 text-2xl font-semibold"><Settings2 /> Settings</div>
      </div>
    {:else}
      <div in:fly={{ x: '-100%' }} class="flex flex-1 items-center gap-1">
        <Button outline size="xs" class="border-none" color="light">
          {@render conditionModeIconComponent(currentMode)}
          <ChevronDownOutline class="ms-2 h-6 w-6" />
        </Button>
        <Dropdown bind:open={dropdownIconOpen}>
          {#each ['cold', 'hot'] as mode}
            <DropdownItem
              class="flex w-[7em] items-center gap-2"
              on:click={() => {
                // Handle mode selection
                dropdownIconOpen = false; // Close the dropdown after selection
                // Additional logic for mode selection can be added here
                currentMode = mode as 'cold' | 'hot'; // Update the current mode
                console.log(`Current mode updated to: ${currentMode}`); // Log the updated mode
              }}
            >
              {@render conditionModeIconComponent(mode as 'cold' | 'hot')}
            </DropdownItem>
          {/each}
        </Dropdown>


        <span class="self-center whitespace-nowrap text-2xl font-semibold">

          Climatisation {settings.title}</span
        >

        <div class="flex-1"></div>

        <div class="flex items-center gap-1 text-xl">
          <ConditionMode mode={outsideConditionMode} /> <div class="mx-3 flex items-center gap-1 text-2xl font-semibold">
            9°C
          </div>
        </div>
        <NavButton><RefreshCcw /></NavButton>
        <NavButton href="/settings"><Settings2 /></NavButton>
      </div>
    {/if}
  </div>

  {@render children()}
</div>
