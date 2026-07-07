<script lang="ts">
	import Profile from '$lib/components/Profile.svelte';
	import LeetcodeStats from '$lib/components/LeetcodeStats.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { profile } from '$lib/data/profile';
	import { projects } from '$lib/data/projects';
</script>

<main
	class="mx-auto max-w-xl md:max-w-5xl px-2 md:px-4 pt-2 pb-0 md:pt-10 md:pb-4 gap-2 md:gap-4 flex flex-col"
>
	<Profile {profile} />
	<LeetcodeStats />
	<div class="divider my-0"></div>
	<section>
		<ProjectList {projects} />
	</section>
	<div class="divider my-0 pt-6"></div>
	<Footer />
</main>
