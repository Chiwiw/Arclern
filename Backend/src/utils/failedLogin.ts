type Entry = { count: number; firstAttempt: number; lockedUntil?: number };

const store = new Map<string, Entry>();

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const cur = store.get(key);
  if (!cur) {
    store.set(key, { count: 1, firstAttempt: now });
    return;
  }

  // If previous attempts are older than window, reset
  if (now - cur.firstAttempt > LOCK_DURATION_MS) {
    store.set(key, { count: 1, firstAttempt: now });
    return;
  }

  cur.count += 1;
  if (cur.count >= MAX_ATTEMPTS) {
    cur.lockedUntil = now + LOCK_DURATION_MS;
  }
  store.set(key, cur);
}

export function clearAttempts(key: string) {
  store.delete(key);
}

export function getLockInfo(key: string): { locked: boolean; until?: number } {
  const cur = store.get(key);
  if (!cur) return { locked: false };
  if (cur.lockedUntil && cur.lockedUntil > Date.now()) return { locked: true, until: cur.lockedUntil };
  if (cur.lockedUntil && cur.lockedUntil <= Date.now()) {
    // unlock and reset
    store.delete(key);
    return { locked: false };
  }
  return { locked: false };
}
