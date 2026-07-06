<script lang="ts">
	import type { Project, UptimeStatus, GithubRepoStats } from '$lib/types';
	import ProjectCard from './ProjectCard.svelte';

	let { projects }: { projects: Project[] } = $props();
	const githubStats = $state<Record<string, GithubRepoStats>>({});
	const uptimeStats = $state<Record<string, UptimeStatus>>({});

	$effect(() => {
		// TODO -- fetch github and api data, inject into project component
		// TEMP MOCK DATA
		projects.forEach(async (project) => {
			await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
			githubStats[project.slug] = {
				stars: Math.floor(Math.random() * 1000),
				forks: Math.floor(Math.random() * 100),
				pushedAt: new Date(
					new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 100))
				).toISOString(),
				archived: Math.random() > 0.8
			};
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
			/>
		{/each}
	</div>
</div>
