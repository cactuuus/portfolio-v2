import { json } from '@sveltejs/kit';
import { getUptimeStats } from '$lib/server/uptime';

export async function GET() {
	try {
		const stats = await getUptimeStats();
		return json(stats);
	} catch (e) {
		console.error('Failed to fetch uptime stats: ', e);
		return json({ error: 'unavailable' }, { status: 502 });
	}
}
