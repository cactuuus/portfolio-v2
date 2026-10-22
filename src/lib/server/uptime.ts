import {
	type UptimeStats,
	type UptimeStatus,
	type UptimeProvider,
	UptimeProviders
} from '$lib/types';
import { projects } from '$lib/data/projects';
import { getCached, setCached } from './cache';
import { SONAR_API_KEY } from '$app/env/private';

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
