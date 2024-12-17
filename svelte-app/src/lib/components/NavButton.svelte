<script lang="ts">
	import { Button } from 'flowbite-svelte';

	let { children, href = undefined, classNames = '' } = $props();
</script>

<Button color="none" size="xs" {href} class="hover:bg-[rgba(255,255,255,0.2)] {classNames}">
	{@render children()}
</Button>
