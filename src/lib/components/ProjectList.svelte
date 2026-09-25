<script lang="ts">
	import type { Project, UptimeStats, GithubRepoStats } from '$lib/types';
	import { withMinDelay } from '$lib/helpers';
	import ProjectCard from './ProjectCard.svelte';

	let { projects }: { projects: Project[] } = $props();
	const MIN_LOADING_TIME = 300; // ms

	let githubStats = $state<Record<string, GithubRepoStats>>({});
	let githubLoaded = $state(false);
	let uptimeStats = $state<Record<string, UptimeStats>>({});
	let uptimeLoaded = $state(false);

	$effect(() => {
		const startedAt = Date.now();
		const githubPromise = fetch('/api/github').then((r) => (r.ok ? r.json() : Promise.reject()));
		const uptimePromise = fetch('/api/uptime').then((r) => (r.ok ? r.json() : Promise.reject()));
		withMinDelay(githubPromise, startedAt, MIN_LOADING_TIME)
			.then((data: Record<string, GithubRepoStats>) => {
				githubStats = data;
			})
			.catch(() => {
				console.error('Failed to fetch GitHub stats');
			})
			.finally(() => {
				githubLoaded = true;
			});

		withMinDelay(uptimePromise, startedAt, MIN_LOADING_TIME)
			.then((data: Record<string, UptimeStats>) => {
				uptimeStats = data;
			})
			.catch(() => {
				console.error('Failed to fetch APIWatch stats');
			})
			.finally(() => {
				uptimeLoaded = true;
			});
	});
</script>

<div>
	<h3 class="text-xl font-bold font-mono mb-4 px-2 text-center">Personal Projects</h3>
	<div class="flex flex-col gap-8">
		{#each projects as project (project.slug)}
			<ProjectCard
				{project}
				uptimeStats={uptimeStats[project.slug]}
				githubStats={githubStats[project.slug]}
				{githubLoaded}
				{uptimeLoaded}
			/>
		{/each}
	</div>
</div>
