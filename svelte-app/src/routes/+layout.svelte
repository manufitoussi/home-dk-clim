<script lang="ts">
	export const csr = true;
	export const prerender = false;
	export const ssr = false;

	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
