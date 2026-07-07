<script lang="ts">
	import type { ApiwatchMonitorStats } from '$lib/types';
	import { relativeTime } from '$lib/helpers';

	let { apiwatchStats }: { apiwatchStats: ApiwatchMonitorStats } = $props();

	function uptimePercentageLabel(number: number | undefined | null): string {
		if (number === undefined || number === null) return '(--.--%)';
		try {
			return `(${number.toFixed(2)}%)`;
		} catch (e) {
			console.error('Error formatting uptime percentage:', e);
			return '(--.--%)';
		}
	}
</script>

<div
	class="flex items-center gap-1 text-xs font-mono tooltip tooltip-info tooltip-left tooltip-start cursor-default"
>
	{#if !apiwatchStats.isEnabled}
		<span class="text-faint">
			<span class="status status-neutral"></span>paused
		</span>
	{:else}
		{#if apiwatchStats.lastCheckSuccess}
			<span class="text-success">
				<span class="status status-success aura aura-glow"></span> up
			</span>
		{:else}
			<span class="text-error">
				<span class="status status-error aura aura-glow"></span> down
			</span>
		{/if}
		<span class="text-faint">{uptimePercentageLabel(apiwatchStats?.uptime)}</span>
	{/if}
	<div class="tooltip-content text-left">
		<span class="font-semibold">Uptime data</span>
		<ul class="list-disc list-inside">
			<li class="flex items-center justify-between gap-4">
				<span>Last checked:</span>
				<span>{relativeTime(apiwatchStats.lastCheckedAt)}</span>
			</li>
			<li class="flex items-center justify-between gap-4">
				<span>Avg response time:</span>
				<span>{apiwatchStats.avgResponseTime.toFixed(2)} ms</span>
			</li>
			<li class="flex items-center justify-between gap-4">
				<span>Total checks:</span>
				<span>{apiwatchStats.totalChecks}</span>
			</li>
			<li class="flex items-center justify-between gap-4">
				<span>Successful checks:</span>
				<span>{apiwatchStats.successCount}</span>
			</li>
			<li class="flex items-center justify-between gap-4">
				<span>Failed checks:</span>
				<span>{apiwatchStats.failureCount}</span>
			</li>
			<li class="flex items-center justify-between gap-4">
				<span>Check frequency:</span>
				<span>{apiwatchStats.checkFrequency} seconds</span>
			</li>
		</ul>
	</div>
</div>
