import React from 'react';
import { formatDate } from '../helpers/formatDate';

// PUBLIC_INTERFACE
export default function NoteItem({ note, selected, onSelect, onToggleFavorite }) {
  /** A single note row with title, updated time, and star button. */
  return (
    <div
      className={`note-item ${selected ? 'selected' : ''}`}
      role="listitem"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect();
      }}
      aria-current={selected ? 'true' : 'false'}
    >
      <div>
        <div className="note-title">{note.title || 'Untitled'}</div>
        <div className="note-meta">Updated {formatDate(note.updatedAt)}</div>
      </div>
      <button
        className="star-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={note.favorite ? 'Unfavorite note' : 'Favorite note'}
        title={note.favorite ? 'Unfavorite' : 'Favorite'}
      >
        <span className={`star ${note.favorite ? 'fav' : ''}`}>★</span>
      </button>
    </div>
  );
}
