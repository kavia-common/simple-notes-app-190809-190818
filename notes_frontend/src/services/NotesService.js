const STORAGE_KEY = 'notes.v1';

// PUBLIC_INTERFACE
export class NotesService {
  /**
   * Data access abstraction for notes.
   * By default uses localStorage. If REACT_APP_API_BASE is defined, you can
   * extend methods to fetch from a backend (TODO stubs provided).
   */
  constructor() {
    this.apiBase = process.env.REACT_APP_API_BASE;
  }

  _read() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }

  // PUBLIC_INTERFACE
  persist(notes) {
    /** Persist notes array to localStorage. */
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes || []));
    } catch {
      // ignore quota errors
    }
  }

  // PUBLIC_INTERFACE
  listNotes() {
    /** Return all notes, newest first. */
    if (this.apiBase) {
      // TODO: fetch(`${this.apiBase}/notes`)
      return this._read().sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return this._read().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // PUBLIC_INTERFACE
  getNote(id) {
    /** Return a single note by id. */
    if (!id) return null;
    const list = this._read();
    return list.find((n) => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  createNote({ title = '', body = '' }) {
    /** Create a note and persist. */
    const now = Date.now();
    const note = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(now) + Math.random().toString(36).slice(2),
      title,
      body,
      favorite: false,
      createdAt: now,
      updatedAt: now
    };
    const list = this._read();
    list.unshift(note);
    this.persist(list);
    return note;
  }

  // PUBLIC_INTERFACE
  updateNote(id, { title = '', body = '' }) {
    /** Update a note and persist. */
    const list = this._read();
    const idx = list.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    const now = Date.now();
    const updated = { ...list[idx], title, body, updatedAt: now };
    list[idx] = updated;
    this.persist(list);
    return updated;
  }

  // PUBLIC_INTERFACE
  deleteNote(id) {
    /** Delete note by id. */
    const list = this._read().filter((n) => n.id !== id);
    this.persist(list);
    return true;
  }

  // PUBLIC_INTERFACE
  toggleFavorite(id) {
    /** Toggle favorite flag and persist. */
    const list = this._read();
    const idx = list.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], favorite: !list[idx].favorite, updatedAt: Date.now() };
    this.persist(list);
    return list[idx];
  }

  // PUBLIC_INTERFACE
  search(query) {
    /** Search by substring in title or body. */
    const q = (query || '').trim().toLowerCase();
    if (!q) return this.listNotes();
    return this.listNotes().filter((n) =>
      (n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q)
    );
  }
}
