<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { page } from '$app/stores';
	import { Button, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	import { CogOutline, HomeOutline } from 'flowbite-svelte-icons';

	let title = $state('');
	let activeUrl = $state('');
	function setupTitle() {
		title = window.api.settings.getTitle();
	}

	$effect(() => {
		activeUrl = $page.url.pathname;
	});

	$effect(() => {
		setupTitle();
	});
</script>

<Navbar color="primary">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">{title}</span>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl}>
		<NavLi href="/"><HomeOutline /></NavLi>
		<NavLi href="/settings"><CogOutline /></NavLi>
	</NavUl>
	<span class="inline-flex"> Température</span>

	<Button href="/login" class="hidden sm:block">Login</Button>
</Navbar>
<p>{activeUrl}</p>

{@render children()}
