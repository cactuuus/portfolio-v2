<script lang="ts">
	import NormalLink from './NormalLink.svelte';
	import { asset } from '$app/paths';
	import type { Profile } from '$lib/types';

	let { profile }: { profile: Profile } = $props();
</script>

<div class="card md:card-side min-h-50">
	<figure
		class="relative w-fit rounded-box shrink-0 overflow-hidden bg-base-100 border shadow-sm border-base-content/10"
	>
		<div class="absolute inset-0 bg-primary/60"></div>
		<img
			class="aspect-video md:max-w-xs object-cover grayscale contrast-125"
			src={asset(profile.image)}
			alt="Me (the human) and Hannibal (the cat)"
		/>
	</figure>
	<div class="card-body items-center md:items-start pt-4 md:pt-0 pb-2">
		<div class="card-title flex flex-col items-center md:items-start gap-1 font-mono">
			<h1 class="font-mono text-4xl md:text-5xl">{profile.name}</h1>
			<h2 class="font-mono text-primary text-sm font-normal text-center md:text-left">
				{profile.title}
			</h2>
		</div>
		<div
			class="flex flex-col gap-2 md:gap-4 justify-items-stretch md:items-start text-base-content/80 text-sm"
		>
			<p class="grow text-center md:text-left">
				{#each profile.description as paragraph, i (i)}
					{paragraph}
					{#if i < profile.description.length - 1}
						<br />
					{/if}
				{/each}
			</p>
			<div class="hidden md:flex gap-2 mt-2 md:mt-4 flex-wrap justify-center md:justify-start">
				{#each profile.skills as skill, i (i)}
					<span class="badge badge-neutral badge-sm">{skill}</span>
				{/each}
			</div>
		</div>
		<div class="card-actions font-mono text-sm gap-8 md:gap-6">
			{#each profile.links as link, i (i)}
				<NormalLink {link} />
			{/each}
		</div>
	</div>
</div>
