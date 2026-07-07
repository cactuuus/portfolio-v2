<script lang="ts">
	import '../app.css';
	import faviconLight from '$lib/assets/favicon-light.ico';
	import faviconDark from '$lib/assets/favicon-dark.ico';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={faviconLight} media="(prefers-color-scheme: light)" />
	<link rel="icon" href={faviconDark} media="(prefers-color-scheme: dark)" />
</svelte:head>
{@render children()}
