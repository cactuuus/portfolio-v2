<script lang="ts">
	import '../app.css';
	import faviconLight from '$lib/assets/favicon-light.ico';
	import faviconDark from '$lib/assets/favicon-dark.ico';

	let { children } = $props();

	const title = 'Jacopo Calvi — Software Developer';
	const description =
		'Software developer, graduated from the University of Sussex with a First Class Honours degree in Computer Science. I tinker with many different technologies, with particular focus on web development.';
</script>

<svelte:head>
	<link rel="icon" href={faviconLight} media="(prefers-color-scheme: light)" />
	<link rel="icon" href={faviconDark} media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#121c22" media="(prefers-color-scheme: dark)" />
	<link rel="canonical" href="https://jacopocalvi.com" />
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="https://jacopocalvi.com/og-image.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:url" content="https://jacopocalvi.com" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
{@render children()}
