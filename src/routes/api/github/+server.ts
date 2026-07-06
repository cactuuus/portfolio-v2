import { json } from '@sveltejs/kit';
import { projects } from '$lib/data/projects';
import { GITHUB_USERNAME } from '$lib/config';
import type { GithubRepoStats } from '$lib/types';
import { fetchGithubRepoStats } from '$lib/server/github';
import { getCached, setCached } from '$lib/server/cache';

// GitHub has rate-limiting of 60 requests per hour for unauthenticated requests.
const TTL = 20 * 60 * 1000; // 20 mins

export async function GET() {
	const cached = getCached<Record<string, GithubRepoStats>>(`github:repos-stats`);
	if (cached) return json(cached);

	const stats: Record<string, GithubRepoStats> = {};
	const withRepo = projects.filter((project) => project.ghRepoName !== undefined);

	const responses = await Promise.allSettled(
		withRepo.map((project) => fetchGithubRepoStats(GITHUB_USERNAME, project.ghRepoName!))
	);

	for (const [i, res] of responses.entries()) {
		// ignore unsuccessful fetches, but log them for debugging
		if (res.status === 'fulfilled') {
			stats[withRepo[i].slug] = res.value;
		} else {
			console.error(`Failed to fetch stats for project "${withRepo[i].slug}":`, res.reason);
		}
	}

	console.debug('Fetched GitHub stats for %d projects', withRepo.length);
	console.debug('Stats:', stats);

	setCached(`github:repos-stats`, stats, TTL);
	return json(stats);
}
