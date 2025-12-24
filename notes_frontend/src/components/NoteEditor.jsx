import React, { useEffect, useRef, useState } from 'react';
import { formatDate } from '../helpers/formatDate';

// PUBLIC_INTERFACE
export default function NoteEditor({
  note,
  isCreating,
  onSave,
  onDelete,
  onToggleFavorite,
  onCancel
}) {
  /**
   * Editor with title/body inputs.
   * Keyboard accessibility:
   * - Enter (Cmd/Ctrl+Enter in body) to save
   * - Escape to cancel when creating
   */
  const [title, setTitle] = useState(note?.title || '');
  const [body, setBody] = useState(note?.body || '');
  const titleRef = useRef(null);

  useEffect(() => {
    if (isCreating && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    setTitle(note?.title || '');
    setBody(note?.body || '');
  }, [note?.id]);

  const handleSave = () => {
    onSave({ title: title.trim(), body: body.trim() });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isCreating) {
      onCancel();
    }
  };

  return (
    <section className="panel editor" aria-label="Note editor" onKeyDown={handleKeyDown}>
      <input
        ref={titleRef}
        className="title"
        type="text"
        placeholder={isCreating ? 'New note title...' : 'Title'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
        }}
        aria-label="Note title"
      />
      <textarea
        className="body"
        placeholder="Write your note here... (Markdown-like plain text)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSave();
        }}
        aria-label="Note body"
      />
      <div className="actions">
        <div className="left-actions">
          <button className="primary-btn" onClick={handleSave} aria-label="Save note">
            💾 Save
          </button>
          <button
            className="sec-btn"
            onClick={onToggleFavorite}
            aria-label={note?.favorite ? 'Unfavorite' : 'Favorite'}
            disabled={!note && !isCreating}
            title={note?.favorite ? 'Unfavorite' : 'Favorite'}
          >
            {note?.favorite ? '★ Favorited' : '☆ Favorite'}
          </button>
        </div>
        <div className="right-actions">
          {isCreating ? (
            <button className="sec-btn" onClick={onCancel} aria-label="Cancel">
              Cancel
            </button>
          ) : (
            <button className="danger-btn" onClick={onDelete} aria-label="Delete note">
              🗑 Delete
            </button>
          )}
        </div>
      </div>
      <div className="meta" aria-live="polite">
        {note
          ? `Created ${formatDate(note.createdAt)} • Updated ${formatDate(note.updatedAt)}`
          : 'Creating a new note'}
      </div>
    </section>
  );
}
