/**
 * Demo localStorage persistence layer.
 *
 * This is a placeholder for a future backend integration.
 * A backend developer can replace these functions with real API calls
 * (e.g., Supabase queries) without touching the UI components.
 */

const KEYS = {
  USERS: 'siot_users',
  PROFILES: 'siot_profiles',
  CAMPAIGNS: 'siot_campaigns',
  APPLICATIONS: 'siot_applications',
  SUBMISSIONS: 'siot_submissions',
  SHIPPING: 'siot_shipping',
  POOL: 'siot_creator_pool',
  CURRENT_USER: 'siot_current_user',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail — demo environment
  }
}

export const storage = {
  keys: KEYS,
  read,
  write,
};

/** Generate a unique ID with an optional prefix. */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
