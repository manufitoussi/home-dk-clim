<script lang="ts">
	import '../app.css';

	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	import { CogOutline, HomeOutline } from 'flowbite-svelte-icons';

	let { children, data } = $props();

	let activeUrl = $state('');

	const { settings } = data;

	$effect(() => {
		activeUrl = $page.url.pathname;
	});
</script>

<div class="flex h-screen flex-col w-full">
	<Navbar color="form" class="bg-sky-500 text-white">
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold"
				>Climatisation {settings.title}</span
			>
		</NavBrand>
		<NavHamburger />
		<NavUl {activeUrl} >
			<NavLi href="/" class="text-white"><HomeOutline /></NavLi>
			<NavLi href="/settings" class="text-white"><CogOutline /></NavLi>
		</NavUl>
		<span> Extérieur <b>9°C</b></span>
	</Navbar>

	{@render children()}
</div>
