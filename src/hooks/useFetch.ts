import { useEffect, useState } from 'react';

interface FetchState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}

const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
	data: unknown;
	timestamp: number;
}

function getCached<T>(key: string, ttl: number): T | null {
	try {
		const raw = sessionStorage.getItem(key);
		if (!raw) return null;
		const entry: CacheEntry = JSON.parse(raw);
		if (Date.now() - entry.timestamp > ttl) {
			sessionStorage.removeItem(key);
			return null;
		}
		return entry.data as T;
	} catch {
		return null;
	}
}

function setCache(key: string, data: unknown) {
	try {
		const entry: CacheEntry = { data, timestamp: Date.now() };
		sessionStorage.setItem(key, JSON.stringify(entry));
	} catch {
		// sessionStorage full or unavailable — silently skip
	}
}

export function useFetch<T>(url: string | null, ttl = DEFAULT_TTL): FetchState<T> {
	const [state, setState] = useState<FetchState<T>>(() => {
		if (!url) return { data: null, loading: false, error: null };
		const cached = getCached<T>(url, ttl);
		if (cached) return { data: cached, loading: false, error: null };
		return { data: null, loading: true, error: null };
	});

	useEffect(() => {
		if (!url) {
			setState({ data: null, loading: false, error: null });
			return;
		}

		const cached = getCached<T>(url, ttl);
		if (cached) {
			setState({ data: cached, loading: false, error: null });
			return;
		}

		const controller = new AbortController();
		setState((prev) => ({ ...prev, loading: true, error: null }));

		fetch(url, { signal: controller.signal })
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json() as Promise<T>;
			})
			.then((data) => {
				setCache(url, data);
				setState({ data, loading: false, error: null });
			})
			.catch((err) => {
				if (err.name === 'AbortError') return;
				setState({ data: null, loading: false, error: err.message });
			});

		return () => controller.abort();
	}, [url, ttl]);

	return state;
}
