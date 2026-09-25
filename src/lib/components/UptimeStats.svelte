<script lang="ts">
	import { type UptimeStats, UptimeStatuses } from '$lib/types';
	import { relativeTime } from '$lib/helpers';

	let { uptimeStats }: { uptimeStats: UptimeStats } = $props();

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
	{#if uptimeStats.status === UptimeStatuses.UP}
		<span class="text-success">
			<span class="status status-success aura aura-glow"></span> up
		</span>
	{:else if uptimeStats.status === UptimeStatuses.DOWN}
		<span class="text-error">
			<span class="status status-error aura aura-glow"></span> down
		</span>
	{:else if uptimeStats.status === UptimeStatuses.PAUSED}
		<span class="text-warning">
			<span class="status status-warning"></span> paused
		</span>
	{:else if uptimeStats.status === UptimeStatuses.PENDING}
		<span class="text-muted">
			<span class="status"></span> pending
		</span>
	{/if}
	{#if uptimeStats.status === UptimeStatuses.UP || uptimeStats.status === UptimeStatuses.DOWN}
		<span class="text-faint">{uptimePercentageLabel(uptimeStats?.uptime)}</span>
	{/if}
	<div class="tooltip-content text-left">
		<span class="font-semibold">Uptime data (by {uptimeStats.provider})</span>
		<ul class="list-disc list-inside">
			<li class="flex items-center justify-between gap-4">
				<span>Last checked:</span>
				<span>{uptimeStats.lastCheckedAt ? relativeTime(uptimeStats.lastCheckedAt) : 'never'}</span>
			</li>
			{#if uptimeStats.status === UptimeStatuses.UP || uptimeStats.status === UptimeStatuses.DOWN}
				<li class="flex items-center justify-between gap-4">
					<span>Avg response time:</span>
					<span>
						{uptimeStats.avgResponseTime
							? `${uptimeStats.avgResponseTime.toFixed(2)} ms`
							: 'N/A'}</span
					>
				</li>
				<li class="flex items-center justify-between gap-4">
					<span>Total checks:</span>
					<span>{uptimeStats.totalChecks}</span>
				</li>
				<li class="flex items-center justify-between gap-4">
					<span>Successful checks:</span>
					<span>{uptimeStats.successCount}</span>
				</li>
				<li class="flex items-center justify-between gap-4">
					<span>Failed checks:</span>
					<span>{uptimeStats.failureCount}</span>
				</li>
				<li class="flex items-center justify-between gap-4">
					<span>Check frequency:</span>
					<span>{uptimeStats.checkFrequency} seconds</span>
				</li>
			{/if}
		</ul>
	</div>
</div>
