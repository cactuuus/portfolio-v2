<script lang="ts">
	import type { Project, UptimeStatus, GithubRepoStats } from '$lib/types';
	import ProjectCard from './ProjectCard.svelte';

	let { projects }: { projects: Project[] } = $props();
	const MIN_LOADING_TIME = 800; // ms

	let githubStats = $state<Record<string, GithubRepoStats>>({});
	let githubLoaded = $state(false);

	let uptimeStats = $state<Record<string, UptimeStatus>>({});

	$effect(() => {
		// TODO -- fetch github and api data, inject into project component
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

		// TEMP MOCK DATA FOR APIWATCH
		projects.forEach(async (project) => {
			await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
			uptimeStats[project.slug] = {
				up: Math.random() > 0.5,
				uptime: Math.floor(Math.random() * 10000) / 100
			};
		});
	});
</script>

<div>
	<h3 class="text-xl font-bold font-mono mb-4 px-2">Personal Projects</h3>
	<div class="flex flex-col gap-8">
		{#each projects as project (project.slug)}
			<ProjectCard
				{project}
				uptimeStatus={uptimeStats[project.slug]}
				githubStats={githubStats[project.slug]}
				{githubLoaded}
			/>
		{/each}
	</div>
</div>
