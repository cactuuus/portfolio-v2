<script lang="ts">
	import NormalLink from './NormalLink.svelte';
	import { asset } from '$app/paths';
	import type { Profile } from '$lib/types';

	let { profile }: { profile: Profile } = $props();
</script>

<div class="card sm:card-side min-h-50">
	<figure class="relative w-fit">
		<img
			class="aspect-video sm:max-w-xs object-cover rounded-box grayscale contrast-125"
			src={asset(profile.image)}
			alt="Me (the human) and Hannibal (the cat)"
		/>
		<div
			class="absolute inset-0 bg-primary/40 mix-blend-multiply rounded-box pointer-events-none"
		></div>
	</figure>
	<div class="card-body items-center sm:items-start pt-4 sm:pt-0 pb-2">
		<div class="card-title flex flex-col items-center sm:items-start gap-1 font-mono">
			<h1 class="font-mono text-4xl sm:text-5xl">{profile.name}</h1>
			<h2 class="font-mono font-normal text-primary text-sm">{profile.title}</h2>
		</div>
		<div
			class="flex flex-col gap-2 sm:gap-4 mb-2 sm:mb-4 items-center sm:items-start text-base-content/80"
		>
			<p>
				{#each profile.description as paragraph, i (i)}
					<span class="text-sm grow">{paragraph}</span>
					{#if i < profile.description.length - 1}
						<br />
					{/if}
				{/each}
			</p>
			<div class="hidden sm:flex gap-2 flex-wrap justify-center sm:justify-start">
				{#each profile.skills as skill, i (i)}
					<span class="badge badge-neutral badge-sm">{skill}</span>
				{/each}
			</div>
		</div>
		<div class="card-actions font-mono text-sm gap-8 sm:gap-6">
			{#each profile.links as link, i (i)}
				<NormalLink {link} />
			{/each}
		</div>
	</div>
</div>
