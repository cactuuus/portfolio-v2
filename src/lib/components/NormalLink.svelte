<script lang="ts">
	import type { Link } from '$lib/types';
	import { asset } from '$app/paths';

	let { link, classes = '' }: { link: Link; classes?: string } = $props();
</script>

<a
	href={link.ownAsset ? asset(link.url) : link.url}
	target={link.newTab ? '_blank' : '_self'}
	rel={link.newTab ? 'noopener noreferrer' : undefined}
	class="link hover:text-secondary font-mono link-primary lowercase text-sm {classes}"
>
	→ {link.label}
</a>
