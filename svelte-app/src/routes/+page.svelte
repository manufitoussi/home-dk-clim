<script>
	import { ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ x: '-100%' }} class="flex flex-1 flex-col overflow-auto pb-16">
	<Skeleton divClass="mt-16 mb-8" />
	<ImagePlaceholder divClass="my-8" />
	<TextPlaceholder divClass="my-8" />
</div>
