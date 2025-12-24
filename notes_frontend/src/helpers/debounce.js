 // PUBLIC_INTERFACE
export function debounce(fn, wait = 200) {
  /** Create a debounced function wrapper. */
  let t;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
