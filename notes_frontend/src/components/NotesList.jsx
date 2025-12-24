import React from 'react';
import NoteItem from './NoteItem';

// PUBLIC_INTERFACE
export default function NotesList({
  notes,
  selectedId,
  onSelect,
  onToggleFavorite,
  section,
  filter
}) {
  /** Renders notes with empty states and favorite toggles. */
  return (
    <section className="panel" aria-label="Notes list">
      {notes.length === 0 ? (
        <div className="empty" role="status">
          {filter
            ? 'No notes match your search.'
            : section === 'favorites'
              ? 'No favorite notes yet.'
              : 'No notes yet. Create your first note!'}
        </div>
      ) : (
        <div className="notes-list" role="list">
          {notes.map((n) => (
            <NoteItem
              key={n.id}
              note={n}
              selected={n.id === selectedId}
              onSelect={() => onSelect(n.id)}
              onToggleFavorite={() => onToggleFavorite(n.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
