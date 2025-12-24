 // PUBLIC_INTERFACE
export function formatDate(ts) {
  /** Format timestamp into a human-friendly date/time string. */
  if (!ts) return 'unknown';
  try {
    const d = new Date(ts);
    const now = Date.now();
    const diff = Math.abs(now - ts);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) return 'just now';
    if (diff < hour) {
      const m = Math.floor(diff / minute);
      return `${m} min${m > 1 ? 's' : ''} ago`;
    }
    if (diff < day) {
      const h = Math.floor(diff / hour);
      return `${h} hour${h > 1 ? 's' : ''} ago`;
    }
    return d.toLocaleString();
  } catch {
    return String(ts);
  }
}
