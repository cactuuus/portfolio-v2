import { json } from '@sveltejs/kit';
import { getApiWatchMonitorsStats } from '$lib/server/apiwatch';

export async function GET() {
	try {
		const stats = await getApiWatchMonitorsStats();
		return json(stats);
	} catch (e) {
		console.error('Failed to fetch ApiWatch monitors stats: ', e);
		return json({ error: 'unavailable' }, { status: 502 });
	}
}
