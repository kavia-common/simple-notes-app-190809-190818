import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from '../helpers/debounce';

// PUBLIC_INTERFACE
export default function Sidebar({
  visible,
  filter,
  onFilterChange,
  section,
  onSectionChange,
  onNewNote
}) {
  /** Sidebar contains tabs for All/Favorites, search input, and New Note button. */
  const [q, setQ] = useState(filter || '');

  const debounced = useMemo(() => debounce(onFilterChange, 250), [onFilterChange]);

  useEffect(() => {
    debounced(q);
  }, [q, debounced]);

  return (
    <aside className={`sidebar ${visible ? '' : 'hidden'}`} aria-label="Sidebar">
      <div className="sidebar-section" role="tablist" aria-label="Filter notes">
        <button
          className={`tab ${section === 'all' ? 'active' : ''}`}
          role="tab"
          aria-selected={section === 'all'}
          onClick={() => onSectionChange('all')}
        >
          All Notes
        </button>
        <button
          className={`tab ${section === 'favorites' ? 'active' : ''}`}
          role="tab"
          aria-selected={section === 'favorites'}
          onClick={() => onSectionChange('favorites')}
        >
          Favorites ★
        </button>
      </div>

      <div className="search">
        <span className="icon" aria-hidden="true">🔎</span>
        <input
          type="search"
          placeholder="Search notes..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search notes by title or body"
        />
      </div>

      <button className="primary-btn" onClick={onNewNote}>
        ＋ New Note
      </button>
    </aside>
  );
}
