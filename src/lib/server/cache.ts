/**
 * A simple in-memory cache implementation for storing key-value pairs with expiration times.
 * TODO: We could consider a better solution for this if needed!
 */
const store = new Map<string, { data: unknown; expires: number }>();

/**
 * Retrieves a cached value for the given key if it exists and has not expired.
 * @param key The key for which to retrieve the cached value.
 * @returns The cached value if it exists and is valid; otherwise, undefined.
 */
export function getCached<T>(key: string): T | undefined {
	const hit = store.get(key);
	if (!hit || hit.expires < Date.now()) return undefined;
	return hit.data as T;
}

/**
 * Caches a value for the given key with a specified time-to-live (TTL).
 * @param key The key for which to cache the value.
 * @param data The value to cache.
 * @param ttlMs The time-to-live (TTL) for the cached value, in milliseconds.
 */
export function setCached(key: string, data: unknown, ttlMs: number) {
	store.set(key, { data, expires: Date.now() + ttlMs });
}
