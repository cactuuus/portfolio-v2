import type { LeetcodeStats } from '$lib/types';
import { toDateString } from '$lib/helpers';
import { LEETCODE_HANDLE } from '$lib/config';
import { getCached, setCached } from './cache';

// Count of problems by difficulty, as returned by LeetCode's API
interface CountEntry {
	difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
	count: number;
}

// User data returned by LeetCode's API
interface RawMatchedUser {
	submitStats: { acSubmissionNum: CountEntry[] };
	badges: { displayName: string }[];
	calThis: { submissionCalendar: string };
	calLast: { submissionCalendar: string };
}

// Response shape from LeetCode's API
interface RawLeetcodeResponse {
	data: {
		allQuestionsCount: CountEntry[];
		matchedUser: RawMatchedUser | null;
	};
}

/**
 * Fetches the LeetCode statistics for the configured user handle, using cached data if available.
 * @returns A promise that resolves to the LeetcodeStats object containing the user's statistics.
 */
export async function getLeetcodeStats(): Promise<LeetcodeStats> {
	const CACHE_KEY = `leetcode:${LEETCODE_HANDLE}`;
	const CACHE_TTL = 10 * 60 * 1000; // 10 mins

	const cached = getCached<LeetcodeStats>(CACHE_KEY);
	if (cached) return cached;

	const freshStats = await fetchLeetcodeStats(LEETCODE_HANDLE);
	setCached(CACHE_KEY, freshStats, CACHE_TTL);
	return freshStats;
}

/**
 * Fetches the LeetCode statistics for a given user handle.
 * @param handle The LeetCode username/handle for which to fetch statistics.
 * @returns A promise that resolves to the LeetcodeStats object containing the user's statistics.
 * @throws An error if the fetch operation fails or if the response is invalid.
 */
async function fetchLeetcodeStats(handle: string): Promise<LeetcodeStats> {
	const QUERY = `
		query userStats($handle: String!, $y1: Int!, $y2: Int!) {
			allQuestionsCount { difficulty count }
			matchedUser(username: $handle) {
				submitStats { acSubmissionNum { difficulty count } }
				badges { displayName }
				calThis: userCalendar(year: $y1) { submissionCalendar }
				calLast: userCalendar(year: $y2) { submissionCalendar }
			}
		}
	`;
	const year = new Date().getFullYear();
	const res = await fetch('https://leetcode.com/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
		body: JSON.stringify({ query: QUERY, variables: { handle, y1: year, y2: year - 1 } })
	});
	if (!res.ok) throw new Error(`LeetCode API fetch failed: ${res.status}`);
	const json = (await res.json()) as RawLeetcodeResponse;
	return parseLeetcodeResponse(json.data);
}

/**
 * Parses the raw LeetCode API response into a structured LeetcodeStats object.
 * @param data The raw API response data.
 * @returns The parsed LeetcodeStats object.
 * @throws An error if the matched user data is missing from the response.
 */
function parseLeetcodeResponse(data: RawLeetcodeResponse['data']): LeetcodeStats {
	if (!data.matchedUser) throw new Error('No matched user in response');
	const user = data.matchedUser;
	const count = (arr: CountEntry[], d: CountEntry['difficulty']) => {
		return arr.find((s) => s.difficulty === d)?.count ?? 0;
	};
	const calThis: Record<string, number> = JSON.parse(user.calThis.submissionCalendar);
	const calLast: Record<string, number> = JSON.parse(user.calLast.submissionCalendar);
	const calendar = { ...calLast, ...calThis }; // merging while keeping the data sorted (ascending)
	const activity = Object.entries(calendar).map(([epoch, count]) => ({
		date: epochToDateString(Number(epoch)),
		submissions: count
	}));
	return {
		solved: {
			easy: count(user.submitStats.acSubmissionNum, 'Easy'),
			medium: count(user.submitStats.acSubmissionNum, 'Medium'),
			hard: count(user.submitStats.acSubmissionNum, 'Hard'),
			total: count(user.submitStats.acSubmissionNum, 'All')
		},
		total: count(data.allQuestionsCount, 'All'),
		badges: user.badges.map((b) => b.displayName),
		streak: computeStreak(activity),
		activity: activity
	};
}

/**
 * Computes the current streak of consecutive days the user has submitted solutions. Today is not required to be part of the streak, but if it is, it will be counted. Any submission counts, not just accepted ones.
 *
 * NOTE:
 * Sadly, I couldn't find a way to actually create a 'daily challenge' streak, as shown on the LeetCode profile page.
 * The API does provide a 'streak' field, but it doesn't seem to have any rhyme or reason as to what it actually tracks.
 * @param activity The user's submission activity.
 * @returns The length of the current streak.
 */
function computeStreak(activity: LeetcodeStats['activity']): number {
	const cursor = new Date();
	let streak = 0;
	// update cursor to yesterday if today is not in the activity list
	if (activity.at(-1)?.date !== toDateString(cursor)) {
		cursor.setDate(cursor.getDate() - 1);
	}
	for (let i = activity.length - 1; i >= 0; i--) {
		if (activity[i].date !== toDateString(cursor) || activity[i].submissions <= 0) break;
		streak++;
		cursor.setDate(cursor.getDate() - 1);
	}
	return streak;
}

/**
 * Converts an epoch timestamp to a date string in the format YYYY-MM-DD.
 * @param epoch The epoch timestamp to convert (in seconds).
 * @returns The date string in the format YYYY-MM-DD.
 */
function epochToDateString(epoch: number): string {
	return toDateString(new Date(epoch * 1000));
}
