import { json } from '@sveltejs/kit';
import { getGithubRepoStats } from '$lib/server/github';

export async function GET() {
	try {
		const stats = await getGithubRepoStats();
		return json(stats);
	} catch (e) {
		console.error('Failed to fetch GitHub repos stats: ', e);
		return json({ error: 'unavailable' }, { status: 502 });
	}
}
