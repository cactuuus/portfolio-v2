<script lang="ts">
	import type { Link } from '$lib/types';
	import { makeGithubUrl } from '$lib/helpers';
	import { GITHUB_USERNAME, THIS_REPO_NAME } from '$lib/config';
	import NormalLink from './NormalLink.svelte';

	const LINK_TO_REPO: Link = {
		label: 'open on GitHub',
		url: makeGithubUrl(GITHUB_USERNAME, THIS_REPO_NAME),
		ownAsset: false,
		newTab: true
	};
</script>

<footer class="font-mono text-xs text-base-content/80 flex flex-col md:flex-row md:gap-4 gap-2 p-4">
	<div class="flex-1 md:text-left text-center hidden md:block"></div>
	<div class="flex-1 text-center">&copy; {new Date().getFullYear()} Jacopo Calvi</div>
	<div class="flex-1 md:text-right text-center">
		<NormalLink link={LINK_TO_REPO} classes="text-xs" />
	</div>
</footer>
