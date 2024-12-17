<script lang="ts">
	import '../app.css';

	import { page } from '$app/state';
	import NavButton from '$lib/components/NavButton.svelte';
	import { ArrowBigLeft, Settings2, Thermometer, RefreshCcw } from 'lucide-svelte';

	let { children, data } = $props();

	let activeUrl = $derived(page.url.pathname);

	const { settings } = data;
</script>

<div class="flex h-screen w-full flex-col">
	<div class="flex items-center gap-1 bg-[#216dcb] p-2 text-white">
		{#if activeUrl === '/settings'}
			<NavButton href="/"><ArrowBigLeft /></NavButton>
			<div class="flex items-center gap-1 text-2xl font-semibold"><Settings2 /> Settings</div>
		{:else}
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
		{/if}
	</div>

	{@render children()}
</div>
