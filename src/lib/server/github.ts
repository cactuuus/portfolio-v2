import type { GithubRepoStats } from '$lib/types';

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
 * Fetches the statistics for a given GitHub repository.
 * @param username The GitHub username.
 * @param repoName The name of the repository.
 * @returns A promise that resolves to the GitHub repository statistics.
 */
export async function fetchGithubRepoStats(
	username: string,
	repoName: string
): Promise<GithubRepoStats> {
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
