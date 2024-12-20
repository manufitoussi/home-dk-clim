<script module lang="ts">
	export const ICONS = {
		'air-vent': AirVent,
		sofa: Sofa,
		'bed-single': BedSingle,
		'bed-double': BedDouble,
		house: House,
		'cooking-pot': CookingPot,
		hammer: Hammer,
		box: Box
	};
</script>

<script lang="ts">
	import {
		AirVent,
		BedDouble,
		BedSingle,
		Box,
		CookingPot,
		Hammer,
		House,
		Sofa
	} from 'lucide-svelte';

	const { icon } = $props();
	let TheIcon = $derived(ICONS[icon as keyof typeof ICONS]);
</script>

<TheIcon />
