/**
 * Converts a Date object to a date string in the format YYYY-MM-DD.
 * @param date The Date object to convert.
 * @returns The date string in the format YYYY-MM-DD.
 */
export function toDateString(date: Date): string {
	return date.toISOString().split('T')[0];
}

/**
 * Simple helper function to create a GitHub URL. It can create a URL for a user or a repository.
 * @param username The GitHub username.
 * @param repoName The name of the repository (optional).
 * @returns The full GitHub URL for the user or repository.
 */
export function makeGithubUrl(username: string, repoName?: string): string {
	const baseUrl = `https://github.com/${username}`;
	if (!repoName) return baseUrl;
	return `${baseUrl}/${repoName}`;
}

/**
 * Converts a date timestamp (given as a string) to a string relative to the current time (for example, "2 hours ago").
 * @param dateStr The date string to convert.
 * @throws An error if the date string is invalid.
 * @returns The relative time string.
 */
export function relativeTime(dateStr: string): string {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) {
		throw new Error(`Invalid date string: ${dateStr}`);
	}
	const MINUTE = 60;
	const HOUR = 60 * MINUTE;
	const DAY = 24 * HOUR;
	const WEEK = 7 * DAY;
	const MONTH = 30 * DAY;
	const YEAR = 365 * DAY;
	const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
	if (diffInSeconds < MINUTE) {
		return `${diffInSeconds} seconds ago`;
	} else if (diffInSeconds < HOUR) {
		const minutes = Math.floor(diffInSeconds / MINUTE);
		return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < DAY) {
		const hours = Math.floor(diffInSeconds / HOUR);
		return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < WEEK) {
		const days = Math.floor(diffInSeconds / DAY);
		return `${days} day${days !== 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < MONTH) {
		const weeks = Math.floor(diffInSeconds / WEEK);
		return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < YEAR) {
		const months = Math.floor(diffInSeconds / MONTH);
		return `${months} month${months !== 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(diffInSeconds / YEAR);
		return `${years} year${years !== 1 ? 's' : ''} ago`;
	}
}

/**
 * Ensures that a promise takes at least a minimum amount of time to resolve, given a start time and a minimum loading time. If the promise resolves faster than the specified minimum loading time, it will wait for the remaining time before returning it.
 * @param promise The promise to wait for.
 * @param startedAt The timestamp (in milliseconds), set externally and used as a reference point for the loading time.
 * @param minLoadingTime The minimum loading time in milliseconds.
 * @returns A promise that resolves after the minimum loading time has elapsed.
 */
export async function withMinDelay<T>(
	promise: Promise<T>,
	startedAt: number,
	minLoadingTime: number
): Promise<T> {
	const waitRemaining = async () => {
		const timeLeft = minLoadingTime - (Date.now() - startedAt);
		if (timeLeft > 0) await new Promise((r) => setTimeout(r, timeLeft));
	};
	try {
		const result = await promise;
		await waitRemaining();
		return result;
	} catch (error) {
		await waitRemaining();
		throw error;
	}
}
