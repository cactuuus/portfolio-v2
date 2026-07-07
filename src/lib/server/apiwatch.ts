import type { ApiwatchMonitorStats } from '$lib/types';

// Raw response shape from ApiWatch's API for a monitor.
interface RawStats {
	uptime: number; // example: 99.91014120667523
	total_checks: number; // example: 7790
	success_count: number; // example: 7783
	failure_count: number; // example: 7
	avg_response_time: number; // example: 207.402567394095
}

// Raw response shape from ApiWatch's API for a monitor.
// It used the widgets (non documented) endpoint for a multi-monitor response, which is more convenient for our use case.
// The widget URL is: https://apiwatch.eu/embed/{widget-id}
// The API endpoint used by it is: https://api.apiwatch.eu/api/v1/public/widgets/{widget-id}
interface RawApiWatchMonitorsResponse {
	monitors: {
		monitor: {
			enabled: boolean;
			is_shared: boolean;
			share_token: string;
			check_frequency_seconds: number; // example: 300
			created_at: string; // example: "2026-06-09T09:41:08.118Z"
			last_checked_at: string; // example: "2026-07-06T21:10:00.927Z"
			latest_check_success: boolean;
		};
		stats: RawStats;
	}[];
}

/**
 * Fetches the uptime statistics for the monitors tracked by the ApiWatch widget.
 */
export async function fetchApiWatchMonitorsStats(
	widgetId: string
): Promise<ApiwatchMonitorStats[]> {
	const res = await fetch(`https://api.apiwatch.eu/api/v1/public/widgets/${widgetId}`);
	if (!res.ok) throw new Error(`ApiWatch API fetch failed: ${res.status}`);

	const data = (await res.json()) as RawApiWatchMonitorsResponse;
	return data.monitors.map((monitor) => ({
		shareToken: monitor.monitor.share_token,
		isEnabled: monitor.monitor.enabled,
		isShared: monitor.monitor.is_shared,
		createdAt: monitor.monitor.created_at,
		checkFrequency: monitor.monitor.check_frequency_seconds,
		lastCheckedAt: monitor.monitor.last_checked_at,
		lastCheckSuccess: monitor.monitor.latest_check_success,
		uptime: monitor.stats.uptime,
		totalChecks: monitor.stats.total_checks,
		successCount: monitor.stats.success_count,
		failureCount: monitor.stats.failure_count,
		avgResponseTime: monitor.stats.avg_response_time
	}));
}
