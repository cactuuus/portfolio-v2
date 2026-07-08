import { json } from '@sveltejs/kit';
import { getLeetcodeStats } from '$lib/server/leetcode';

export async function GET() {
	try {
		const stats = await getLeetcodeStats();
		return json(stats);
	} catch (e) {
		console.error('Failed to fetch LeetCode stats: ', e);
		return json({ error: 'unavailable' }, { status: 502 });
	}
}
