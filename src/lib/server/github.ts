import type { GithubRepoStats, Project } from '$lib/types';
import { projects } from '$lib/data/projects';
import { GITHUB_USERNAME } from '$lib/config';
import { getCached, setCached } from './cache';

// Raw response shape from GitHub's API for a repository
// https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10#get-a-repository
interface RawGithubResponse {
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	pushed_at: string;
	created_at: string;
	archived: boolean;
	license: { name: string } | null;
}

/**
 * Returns the statistics for all GitHub repositories configured in the projects data, using cached data if available.
 * @returns A promise that resolves to a record mapping project slugs to their corresponding GitHub repository statistics.
 */
export async function getGithubRepoStats() {
	// GitHub's API has a rate limit of 60 requests per hour for unauthenticated requests
	const CACHE_TTL = 20 * 60 * 1000; // 20 mins

	// pre-poulate using cache, tracking which repos still need to be fetched
	const toFetch: Project[] = [];
	const statsMap: Record<string, GithubRepoStats> = {};
	for (const project of projects) {
		if (!project.ghRepoName) continue;
		const cached = getCached<GithubRepoStats>(repoCacheKey(project.ghRepoName));
		if (cached) {
			statsMap[project.slug] = cached;
		} else {
			toFetch.push(project);
		}
	}

	// if all repos were cached, return early
	if (toFetch.length === 0) return statsMap;

	// fetch the remaining repos in parallel, and cache the results
	const repoNames = toFetch.map((project) => project.ghRepoName!);
	const repoStats = await batchFetchGithubRepoStats(GITHUB_USERNAME, repoNames);
	for (let i = 0; i < toFetch.length; i++) {
		const repoStat = repoStats[i];
		if (repoStat !== null) {
			statsMap[toFetch[i].slug] = repoStat;
			// each entry in toFetch is guaranteed to have a ghRepoName
			setCached(repoCacheKey(toFetch[i].ghRepoName!), repoStat, CACHE_TTL);
		}
	}
	return statsMap;
}

/**
 * Fetches the statistics for multiple GitHub repositories in parallel, handling errors gracefully.
 * If a request for a specific repository fails, it logs the error and returns null for that repository, allowing the other requests to continue.
 * @param username The GitHub username.
 * @param repoNames The names of the repositories.
 * @returns A promise that resolves to an array of repository statistics or null values for failed requests.
 */
async function batchFetchGithubRepoStats(
	username: string,
	repoNames: string[]
): Promise<(GithubRepoStats | null)[]> {
	const responses = await Promise.allSettled(
		repoNames.map((repoName) => fetchGithubRepoStats(username, repoName))
	);
	return responses.map((res, i) => {
		if (res.status === 'fulfilled') {
			return res.value;
		} else {
			console.warn(`Failed to fetch stats for repo "${repoNames[i]}":`, res.reason);
			return null;
		}
	});
}

/**
 * Fetches the statistics for a given GitHub repository.
 * @param username The GitHub username.
 * @param repoName The name of the repository.
 * @returns A promise that resolves to the GitHub repository statistics.
 */
async function fetchGithubRepoStats(username: string, repoName: string): Promise<GithubRepoStats> {
	const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
		headers: {
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2026-03-10',
			'User-Agent': username
		}
	});
	if (!res.ok) throw new Error(`GitHub API fetch failed: ${res.status}`);
	const data = (await res.json()) as RawGithubResponse;
	return {
		stars: data.stargazers_count,
		forks: data.forks_count,
		openIssuesAndPRs: data.open_issues_count,
		pushedAt: data.pushed_at,
		createdAt: data.created_at,
		archived: data.archived,
		license: data.license ? data.license.name : null
	};
}

/**
 * Generates a cache key for storing GitHub repository statistics in the cache.
 * @param repoName The name of the repository.
 * @returns The cache key.
 */
function repoCacheKey(repoName: string): string {
	return `github:repo:${repoName}`;
}
