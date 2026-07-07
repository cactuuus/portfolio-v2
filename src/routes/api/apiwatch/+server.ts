import { json } from '@sveltejs/kit';
import { getCached, setCached } from '$lib/server/cache';
import { fetchApiWatchMonitorsStats } from '$lib/server/apiwatch';
import type { ApiwatchMonitorStats } from '$lib/types';
import { projects } from '$lib/data/projects';
import { APIWATCH_MONITORS_WIDGET_ID } from '$lib/config';

// my checks are set to 5 minutess intervals, this is set to match
const TTL = 5 * 60 * 1000; // 5 mins

export async function GET() {
	const cached = getCached<Record<string, ApiwatchMonitorStats>>(`apiwatch:monitors-stats`);
	if (cached) return json(cached);
	try {
		const monitorsStats = await fetchApiWatchMonitorsStats(APIWATCH_MONITORS_WIDGET_ID);
		const byShareToken: Record<string, ApiwatchMonitorStats> = {};
		for (const stat of monitorsStats) {
			byShareToken[stat.shareToken] = stat;
		}
		const statsMap: Record<string, ApiwatchMonitorStats> = {};
		for (const project of projects) {
			const token = project.apiwatchShareToken;
			if (!token) continue;
			const stats = byShareToken[token];
			if (!stats) {
				console.warn(
					`No ApiWatch stats found for project "${project.slug}" with share token "${token}"`
				);
				continue;
			}
			statsMap[project.slug] = stats;
		}
		setCached(`apiwatch:monitors-stats`, statsMap, TTL);
		return json(statsMap);
	} catch (e) {
		console.error('Failed to fetch ApiWatch monitors stats: ', e);
		return json({ error: 'unavailable' }, { status: 502 });
	}
}
