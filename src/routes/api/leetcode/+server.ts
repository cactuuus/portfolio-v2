import { json } from '@sveltejs/kit';
import { fetchLeetcodeStats } from '$lib/server/leetcode';
import { getCached, setCached } from '$lib/server/cache';
import { LEETCODE_HANDLE } from '$lib/config';

const TTL = 10 * 60 * 1000; // 10 mins

export async function GET() {
	const cached = getCached(`leetcode:${LEETCODE_HANDLE}`);
	if (cached) return json(cached);
	try {
		const stats = await fetchLeetcodeStats(LEETCODE_HANDLE);
		setCached(`leetcode:${LEETCODE_HANDLE}`, stats, TTL);
		return json(stats);
	} catch (e) {
		console.error('Failed to fetch LeetCode stats: ', e);
		return json({ error: 'unavailable' }, { status: 502 });
	}
}
