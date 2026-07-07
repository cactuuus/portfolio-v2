<script lang="ts">
	import type { Project, ApiwatchMonitorStats, GithubRepoStats } from '$lib/types';
	import ProjectCard from './ProjectCard.svelte';

	let { projects }: { projects: Project[] } = $props();
	const MIN_LOADING_TIME = 300; // ms

	let githubStats = $state<Record<string, GithubRepoStats>>({});
	let githubLoaded = $state(false);

	let apiwatchStats = $state<Record<string, ApiwatchMonitorStats>>({});
	let apiwatchLoaded = $state(false);

	$effect(() => {
		const startedAt = Date.now();
		fetch('/api/github')
			.then((r) => (r.ok ? r.json() : Promise.reject()))
			.then(async (data: Record<string, GithubRepoStats>) => {
				const elapsed = Date.now() - startedAt;
				if (elapsed < MIN_LOADING_TIME) {
					await new Promise((r) => setTimeout(r, MIN_LOADING_TIME - elapsed));
				}
				githubStats = data;
				githubLoaded = true;
			})
			.catch(() => {});

		fetch('/api/apiwatch')
			.then((r) => (r.ok ? r.json() : Promise.reject()))
			.then(async (data: Record<string, ApiwatchMonitorStats>) => {
				const elapsed = Date.now() - startedAt;
				if (elapsed < MIN_LOADING_TIME) {
					await new Promise((r) => setTimeout(r, MIN_LOADING_TIME - elapsed));
				}
				apiwatchStats = data;
				apiwatchLoaded = true;
			})
			.catch(() => {});
	});
</script>

<div>
	<h3 class="text-xl font-bold font-mono mb-4 px-2">Personal Projects</h3>
	<div class="flex flex-col gap-8">
		{#each projects as project (project.slug)}
			<ProjectCard
				{project}
				apiwatchStats={apiwatchStats[project.slug]}
				githubStats={githubStats[project.slug]}
				{githubLoaded}
				{apiwatchLoaded}
			/>
		{/each}
	</div>
</div>
