<script lang="ts">
	import '../app.css';

	import { page } from '$app/state';
	import NavButton from '$lib/components/NavButton.svelte';
	import { ArrowBigLeft, RefreshCcw, Settings2, Thermometer } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let { children, data } = $props();

	let activeUrl = $derived(page.url.pathname);

	const { settings } = data;
</script>

<div in:fade|global class="flex h-screen w-full flex-1 flex-col overflow-hidden">
	<div class="flex items-center gap-1 bg-[#216dcb] p-2 text-white">
		{#if activeUrl === '/settings'}
			<div in:fly={{ x: '100%' }} class="flex flex-1 items-center gap-1">
				<NavButton href="/"><ArrowBigLeft /></NavButton>
				<div class="flex items-center gap-1 text-2xl font-semibold"><Settings2 /> Settings</div>
			</div>
		{:else}
			<div in:fly={{ x: '-100%' }} class="flex flex-1 items-center gap-1">
				<span class="self-center whitespace-nowrap text-2xl font-semibold">
					Climatisation {settings.title}</span
				>

				<div class="flex-1"></div>

				<div class="flex items-center gap-1 text-xl">
					Extérieur <div class="mx-3 flex items-center gap-1 text-3xl font-semibold">
						<Thermometer size="0.9em" /> 9°C
					</div>
				</div>
				<NavButton><RefreshCcw /></NavButton>
				<NavButton href="/settings"><Settings2 /></NavButton>
			</div>
		{/if}
	</div>

	{@render children()}
</div>
