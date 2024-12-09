<script>
	import { ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	import { HomeOutline } from 'flowbite-svelte-icons';
</script>


<div class="flex-1 overflow-auto pb-16">
	<h2 class="flex items-center space-x-4"><HomeOutline class="size-10" /> HOME</h2>
	<Skeleton  divClass="mt-16 mb-8" />
	<ImagePlaceholder divClass="my-8" />
	<TextPlaceholder divClass="my-8" />
</div>
