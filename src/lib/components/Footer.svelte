<script lang="ts">
	import type { Link } from '$lib/types';
	import { makeGithubUrl } from '$lib/helpers';
	import { GITHUB_USERNAME, THIS_REPO_NAME } from '$lib/config';
	import NormalLink from './NormalLink.svelte';

	const LINK_TO_LLMS: Link = {
		label: 'llms.txt',
		url: '/llms.txt',
		ownAsset: true,
		newTab: false
	};
	const LINK_TO_REPO: Link = {
		label: 'open on GitHub',
		url: makeGithubUrl(GITHUB_USERNAME, THIS_REPO_NAME),
		ownAsset: false,
		newTab: true
	};
</script>

<footer
	class="font-mono text-xs text-base-content/80 flex items-center flex-row md:gap-4 gap-2 p-4"
>
	<div class="flex-1 text-left items-start"></div>
	<div class="flex-1 text-center items-center">
		&copy; {new Date().getFullYear()} Jacopo Calvi
	</div>
	<div class="flex-1 text-right items-end flex flex-col gap-3 md:gap-1">
		<NormalLink link={LINK_TO_REPO} classes="text-xs" />
		<div class="tooltip tooltip-info tooltip-end" data-tip="Feed me to your LLM!">
			<NormalLink link={LINK_TO_LLMS} classes="text-xs" />
		</div>
	</div>
</footer>
