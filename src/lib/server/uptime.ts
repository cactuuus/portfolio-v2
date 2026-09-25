import {
	type UptimeStats,
	type UptimeStatus,
	type UptimeProvider,
	UptimeProviders,
	UptimeStatuses
} from '$lib/types';
import { projects } from '$lib/data/projects';
import { getCached, setCached } from './cache';
import { SONAR_API_KEY, APIWATCH_MONITORS_WIDGET_ID } from '$app/env/private';

// Raw response shape from ApiWatch's API for a monitor.
// It used the widgets (non documented) endpoint for a multi-monitor response, which is more convenient for our use case.
// The widget URL is: https://apiwatch.eu/embed/{widget-id}
// The API endpoint used by it is: https://api.apiwatch.eu/api/v1/public/widgets/{widget-id}
interface RawApiWatchMonitorsResponse {
	monitors: {
		monitor: {
			enabled: boolean;
			share_token: string;
			check_frequency_seconds: number; // example: 300
			last_checked_at: string; // example: "2026-07-06T21:10:00.927Z"
			latest_check_success: boolean;
		};
		stats: {
			uptime: number; // example: 99.91014120667523
			total_checks: number; // example: 7790
			success_count: number; // example: 7783
			failure_count: number; // example: 7
			avg_response_time: number; // example: 207.402567394095
		};
	}[];
}

// Raw response shape from Sonar's API for a monitor.
interface RawSonarMonitorResponse {
	monitor: {
		public_id: string;
		name: string;
		url: string;
		status: UptimeStatus;
		lastCheckedAt: string;
		frequencySeconds: number;
		breakdowns: {
			all: {
				uptimePercentage: number;
				totalChecks: number;
				successfulChecks: number;
				failedChecks: number;
				avgResponseTimeMs: number;
			};
		};
	};
}

/**
 * Fetches the uptime statistics for all projects that have uptime tracking enabled.
 * @returns A promise that resolves to a record mapping project slugs to their corresponding uptime statistics.
 */
export async function getUptimeStats(): Promise<Record<string, UptimeStats>> {
	const uptimeStats: Record<string, UptimeStats> = {};

	const promises = projects
		.filter((project) => project.uptimeData !== undefined)
		.map(async (project) => {
			try {
				const stats = await fetchUptimeStats(
					project.uptimeData!.provider,
					project.uptimeData!.monitorId
				);
				uptimeStats[project.slug] = stats;
			} catch (error) {
				console.error(`Error fetching uptime stats for project "${project.slug}":`, error);
			}
		});

	await Promise.all(promises);
	return uptimeStats;
}

/**
 * Fetches the uptime statistics for a specific monitor based on its provider and ID.
 * Caches the result to reduce API calls.
 * @param provider The provider of the uptime monitoring service.
 * @param monitorId The ID of the monitor to fetch statistics for.
 * @returns A promise that resolves to the uptime statistics for the specified monitor.
 */
async function fetchUptimeStats(provider: UptimeProvider, monitorId: string): Promise<UptimeStats> {
	const CACHE_KEY = `uptime-stats:${provider}:${monitorId}`;
	const CACHE_TTL = 3 * 60 * 1000; // 3 mins

	const cached = getCached<UptimeStats>(CACHE_KEY);
	if (cached) return cached;

	let uptimeStats: UptimeStats;

	switch (provider) {
		case UptimeProviders.APIWATCH:
			uptimeStats = await fetchApiWatchMonitorStats(monitorId);
			break;
		case UptimeProviders.SONAR:
			uptimeStats = await fetchSonarMonitorStats(monitorId);
			break;
		default:
			throw new Error(`Unsupported uptime provider: ${provider}`);
	}

	setCached(CACHE_KEY, uptimeStats, CACHE_TTL);
	return uptimeStats;
}

/**
 * Fetches the uptime statistics for a specific monitor from the Sonar API.
 * @param monitorId The ID of the monitor to fetch statistics for.
 * @returns A promise that resolves to the uptime statistics for the specified monitor.
 * @throws An error if the fetch operation fails or if the response is invalid.
 */
async function fetchSonarMonitorStats(monitorId: string): Promise<UptimeStats> {
	const res = await fetch(
		`https://sonar.jacopocalvi.com/api/v1/monitors/${monitorId}?breakdowns=all`,
		{
			headers: {
				Authorization: `Bearer ${SONAR_API_KEY}`,
				Accept: 'application/json'
			}
		}
	);
	if (!res.ok) throw new Error(`Sonar API fetch failed: ${res.status}`);

	const data = (await res.json()) as RawSonarMonitorResponse;
	return {
		provider: UptimeProviders.SONAR,
		status: data.monitor.status,
		checkFrequency: data.monitor.frequencySeconds,
		lastCheckedAt: data.monitor.lastCheckedAt,
		uptime: data.monitor.breakdowns.all.uptimePercentage,
		totalChecks: data.monitor.breakdowns.all.totalChecks,
		successCount: data.monitor.breakdowns.all.successfulChecks,
		failureCount: data.monitor.breakdowns.all.failedChecks,
		avgResponseTime: data.monitor.breakdowns.all.avgResponseTimeMs
	};
}

/**
 * Fetches the uptime statistics for a specific monitor from the ApiWatch API.
 * This is very inefficient, as it fetches all monitors in a single request and then filters for the one we want. Not
 * a bi deal though as ApiWatch will eventually fade out and be replacedby a better option.
 * @param monitorId The ID of the monitor to fetch statistics for.
 * @returns A promise that resolves to the uptime statistics for the specified monitor.
 * @throws An error if the fetch operation fails or if the response is invalid.
 */
async function fetchApiWatchMonitorStats(monitorId: string): Promise<UptimeStats> {
	const res = await fetch(
		`https://api.apiwatch.eu/api/v1/public/widgets/${APIWATCH_MONITORS_WIDGET_ID}`
	);
	if (!res.ok) throw new Error(`ApiWatch API fetch failed: ${res.status}`);

	const data = (await res.json()) as RawApiWatchMonitorsResponse;

	for (const monitor of data.monitors) {
		if (monitor.monitor.share_token === monitorId) {
			// Determine the uptime status based on the monitor's enabled state and latest check success.
			let uptimeStatus: UptimeStatus = UptimeStatuses.UNKNOWN;
			if (!monitor.monitor.enabled) {
				uptimeStatus = UptimeStatuses.PAUSED;
			} else if (
				monitor.monitor.latest_check_success === null ||
				monitor.monitor.latest_check_success === undefined
			) {
				uptimeStatus = UptimeStatuses.PENDING;
			} else if (monitor.monitor.latest_check_success === true) {
				uptimeStatus = UptimeStatuses.UP;
			} else if (monitor.monitor.latest_check_success === false) {
				uptimeStatus = UptimeStatuses.DOWN;
			}

			return {
				provider: UptimeProviders.APIWATCH,
				status: uptimeStatus,
				checkFrequency: monitor.monitor.check_frequency_seconds,
				lastCheckedAt: monitor.monitor.last_checked_at,
				uptime: monitor.stats.uptime,
				totalChecks: monitor.stats.total_checks,
				successCount: monitor.stats.success_count,
				failureCount: monitor.stats.failure_count,
				avgResponseTime: monitor.stats.avg_response_time
			};
		}
	}

	throw new Error(`No ApiWatch stats found for monitor with ID "${monitorId}"`);
}
