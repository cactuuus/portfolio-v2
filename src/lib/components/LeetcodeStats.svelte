<script lang="ts">
	import NormalLink from './NormalLink.svelte';
	import type { LeetcodeStats, Link } from '$lib/types';
	import { LEETCODE_HANDLE } from '$lib/config';
	import { toDateString, withMinDelay } from '$lib/helpers';
	import FlameIcon from '~icons/lucide/flame';
	import MedalIcon from '~icons/lucide/medal';

	const LEETCODE_PROFILE_LINK: Link = {
		label: 'see profile',
		url: `https://leetcode.com/u/${LEETCODE_HANDLE}/`,
		ownAsset: false,
		newTab: true
	};
	const LATEST_ACTIVITY_DAYS = 60;
	const LATEST_ACTIVITY_START = latestActivityStart(LATEST_ACTIVITY_DAYS);
	const MIN_LOADING_TIME = 800; // ms

	let stats = $state<LeetcodeStats | null>(null);
	let error = $state(false);
	const latestActivity = $derived<LeetcodeStats['activity']>(filledLatestActivity());

	$effect(() => {
		const promise = fetch('/api/leetcode').then((r) => (r.ok ? r.json() : Promise.reject()));
		withMinDelay(promise, Date.now(), MIN_LOADING_TIME)
			.then((data: LeetcodeStats) => (stats = data))
			.catch(() => (error = true));
	});

	function latestActivityStart(days: number): Date {
		const start = new Date();
		start.setDate(start.getDate() - days + 1);
		return start;
	}

	function filledLatestActivity(): LeetcodeStats['activity'] {
		if (!stats || !stats.activity) return [];
		const activity: LeetcodeStats['activity'] = new Array(LATEST_ACTIVITY_DAYS);
		const cursor = new Date();
		let activityIndex = stats.activity.length - 1;
		for (let i = LATEST_ACTIVITY_DAYS - 1; i >= 0; i--) {
			const date = toDateString(cursor);
			if (activityIndex >= 0 && stats.activity[activityIndex].date === date) {
				activity[i] = stats.activity[activityIndex--];
			} else {
				activity[i] = { date: date, submissions: 0 };
			}
			cursor.setDate(cursor.getDate() - 1);
		}
		return activity;
	}
</script>

<div class="font-mono bg-base-200 px-4 py-2 rounded-box border border-base-content/10 shadow-sm">
	<div class="flex items-center justify-between gap-2 mb-2">
		<h4 class="text-lg font-semibold">LeetCode Stats</h4>
		<NormalLink link={LEETCODE_PROFILE_LINK} />
	</div>

	<div class="relative">
		<div class="w-full inline-grid grid-flow-col md:auto-cols-max md:gap-8">
			<div class="flex flex-col gap-1">
				<span class="text-2xs text-faint uppercase">solved</span>
				<div class="flex items-baseline gap-1">
					<span class="text-xl font-semibold">{stats ? stats.solved.total : '---'}</span>
					<span class="text-faint">/{stats ? stats.total : '----'}</span>
				</div>
			</div>

			<div class="flex flex-col gap-1">
				<span class="text-2xs text-faint uppercase">breakdown</span>
				<div class="flex items-baseline gap-1">
					<div class="text-success">
						<span class="hidden md:inline">easy</span>
						<span class="text-xl font-semibold">{stats ? stats.solved.easy : '---'}</span>
					</div>
					<span class="text-faint">|</span>
					<div class="text-warning">
						<span class="hidden md:inline">med</span>
						<span class="text-xl font-semibold">{stats ? stats.solved.medium : '---'}</span>
					</div>
					<span class="text-faint">|</span>
					<div class="text-error">
						<span class="hidden md:inline">hard</span>
						<span class="text-xl font-semibold">{stats ? stats.solved.hard : '---'}</span>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-1">
				<span class="text-2xs text-faint uppercase">badges</span>
				<div class="flex items-center gap-1">
					<MedalIcon class="h-5 w-5" />
					<span class="font-semibold text-xl">{stats ? stats.badges.length : '--'}</span>
				</div>
			</div>

			<div class="flex flex-col gap-1">
				<span class="text-2xs text-faint uppercase">streak</span>
				<div class="flex items-center gap-1" class:text-primary={stats?.streak}>
					<FlameIcon class="h-5 w-5" />
					<span class="font-semibold text-xl">{stats ? stats.streak : '--'}</span>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-1 mt-2">
			<span class="text-faint text-2xs uppercase">
				recent activity (last {LATEST_ACTIVITY_DAYS} days)
			</span>
			<div class="relative flex gap-1 h-8 items-end">
				<!-- always draw heatmap empty state -->
				{#each Array(LATEST_ACTIVITY_DAYS) as _, i (i)}
					<div class="flex-1 rounded-tiny bg-base-300 h-full"></div>
				{/each}
				<div class="absolute inset-0 flex gap-1 h-8 items-end">
					{#if stats}
						<!-- draw heatmap, if data is present -->
						{#each latestActivity as day, i (day.date)}
							{@const date = new Date(day.date).toLocaleDateString('en-GB')}
							<div
								class="flex-1 tooltip tooltip-info h-full"
								aria-label="{day.submissions} submissions on {date}"
							>
								<div class="tooltip-content">
									{day.submissions} submissions on {date}
								</div>
								<div
									class="rounded-tiny {i === latestActivity.length - 1
										? 'bg-base-content/30'
										: 'bg-base-300'} h-full w-full hover:bg-secondary hover:scale-120 transition-transform duration-100 hover:opacity-100!"
									class:bg-primary={day.submissions > 0}
									style:opacity={day.submissions > 0
										? Math.min(0.2 + day.submissions * 0.15, 1)
										: 1}
								></div>
							</div>
						{/each}
					{:else if !error}
						<!-- if no data nor error are present, we're showing a wavy loading state -->
						{#each Array(LATEST_ACTIVITY_DAYS) as _, i (i)}
							<div
								class="flex-1 rounded-tiny bg-primary wave-bar"
								style:animation-delay="{i * -20}ms"
							></div>
						{/each}
					{/if}
				</div>
			</div>
			<div class="flex justify-between text-faint text-2xs">
				<span>
					{LATEST_ACTIVITY_START.toLocaleDateString('en-GB', {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</span>
				<span>today</span>
			</div>
		</div>
		{#if error}
			<div
				class="absolute inset-0 backdrop-blur-[1px] flex items-center justify-center rounded-box"
			>
				<p class="px-6 py-4 bg-base-300 border border-content text-center rounded-box text-sm">
					Error fetching LeetCode stats. Please try again later.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.wave-bar {
		height: 20%;
		animation: wave 2s ease-in-out infinite;
	}
	@keyframes wave {
		0%,
		100% {
			height: 15%;
			opacity: 0.3;
		}
		50% {
			height: 85%;
			opacity: 0.6;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.wave-bar {
			animation: none;
			height: 20%;
			opacity: 0.3;
		}
	}
</style>
