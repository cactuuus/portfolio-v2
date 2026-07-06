<script lang="ts">
	import { asset } from '$app/paths';
	import type { Project, UptimeStatus, GithubRepoStats } from '$lib/types';
	import { makeGithubUrl, relativeTime } from '$lib/helpers';
	import { GITHUB_USERNAME } from '$lib/config';
	import NormalLink from './NormalLink.svelte';
	import CopyableCommand from './CopyableCommand.svelte';
	import StarIcon from '~icons/lucide/star';

	let {
		project,
		uptimeStatus,
		githubStats
	}: { project: Project; uptimeStatus?: UptimeStatus; githubStats?: GithubRepoStats } = $props();

	const updatedAtLabel = $derived.by<string>(() => {
		if (!githubStats) return 'loading activity data...';
		try {
			if (githubStats.archived) return 'archived';
			else return `last updated ${relativeTime(githubStats.pushedAt)}`;
		} catch (e) {
			console.error('Error parsing date:', e);
			return 'last updated <unknown>';
		}
	});
</script>

<div class="card sm:card-side bg-base-200 overflow-hidden border border-base-content/10 shadow-sm">
	<div class="relative sm:w-2xs md:w-xs bg-base-content/10 shrink-0">
		{#if project.previewImage}
			<figure class="w-full h-full">
				<img
					class="aspect-video object-cover"
					src={asset(project.previewImage)}
					alt={project.title}
				/>
			</figure>
		{:else}
			<div class="flex items-center justify-center h-full w-full">
				<span class="text-faint text-sm font-mono py-4">No preview available</span>
			</div>
		{/if}
	</div>
	<div class="card-body py-2 px-4">
		<div>
			<div class="card-title flex items-center justify-between font-normal">
				<h4 class="font-mono text-lg font-semibold">{project.title}</h4>
				<div class="font-mono text-xs">
					{#if project.apiwatchId}
						<span class="flex items-center gap-1">
							{#if uptimeStatus === undefined}
								<span class="text-faint animate-pulse">
									<span class="status status-neutral"></span>
									loading
								</span>
							{:else if uptimeStatus?.up}
								<span class="text-success">
									<span class="status status-success aura aura-glow"></span> up
								</span>
							{:else}
								<span class="text-error">
									<span class="status status-error aura aura-glow"></span> down
								</span>
							{/if}
							<span class="text-faint">({uptimeStatus?.uptime ?? '--.--'}%)</span>
						</span>
					{:else}
						<div
							class="tooltip tooltip-info tooltip-left tooltip-start cursor-help"
							aria-label="Uptime is not applicable to this project"
						>
							<div class="tooltip-content max-w-50">
								<span>Uptime is not applicable to this project</span>
							</div>
							<span class="text-faint"> N/A </span>
						</div>
					{/if}
				</div>
			</div>

			<div class="flex gap-2 flex-wrap items-center mb-1">
				{#if project.access}
					{#if project.access.kind === 'link'}
						<NormalLink
							link={{
								label: project.access.label,
								url: project.access.value,
								newTab: true,
								ownAsset: false
							}}
						/>
					{:else if project.access.kind === 'command'}
						<CopyableCommand command={project.access.value} />
					{/if}
				{/if}
			</div>
		</div>

		<p class="text-sm text-base-content/80 mb-1">{project.description}</p>

		<div class="flex gap-2 flex-wrap mb-1">
			{#each project.tags as tag (tag)}
				<span class="badge badge-neutral badge-sm">{tag}</span>
			{/each}
		</div>

		{#if project.ghRepoName}
			<div class="flex items-baseline gap-3 flex-wrap">
				<NormalLink
					link={{
						label: 'GitHub',
						url: makeGithubUrl(GITHUB_USERNAME, project.ghRepoName),
						newTab: true,
						ownAsset: false
					}}
				/>
				<span class="flex text-xs items-baseline gap-1 text-faint">
					<StarIcon class="h-3 w-3 translate-y-0.5" />
					{githubStats?.stars ?? '--'}
				</span>
				<div class="text-faint text-2xs grow text-right">
					<span class:animate-pulse={githubStats === undefined}>{updatedAtLabel}</span>
				</div>
			</div>
		{/if}
	</div>
</div>
