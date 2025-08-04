// lib/cache/memory-cache.ts
interface CacheEntry {
    data: unknown
    timestamp: number
    ttl: number
}

class MemoryCache {
    private cache = new Map<string, CacheEntry>()

    set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs
        })
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key)
        if (!entry) return null

        const now = Date.now()
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key)
            return null
        }

        return entry.data as T
    }

    clear() {
        this.cache.clear()
    }
}

export const memoryCache = new MemoryCache()