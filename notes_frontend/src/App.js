import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/theme.css';
import { NotesProvider, useNotes } from './store/NotesContext';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import ConfirmModal from './components/ConfirmModal';
import { NotesService } from './services/NotesService';

// PUBLIC_INTERFACE
function AppShell() {
  /**
   * This is the main application shell that renders:
   * - TopBar (branding, sidebar toggle)
   * - Sidebar (sections and search)
   * - Main content area (notes list and editor)
   * It also handles simple hash-based routing to select the current note.
   */
  const { state, actions } = useNotes();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Hydrate from localStorage on first mount
  useEffect(() => {
    actions.load();
  }, [actions]);

  // Hash-based routing for selected note
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      const match = hash.match(/^#\/note\/(.+)$/);
      if (match) {
        const noteId = decodeURIComponent(match[1]);
        actions.select(noteId);
      } else if (hash === '#/new') {
        actions.select(null);
        actions.startCreate();
      } else {
        // default route shows list, keep current selection
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [actions]);

  const onSelectNote = (id) => {
    window.location.hash = `#/note/${encodeURIComponent(id)}`;
  };

  const onNewNote = () => {
    window.location.hash = '#/new';
  };

  const onDeleteRequest = (id) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const onConfirmDelete = () => {
    if (pendingDeleteId) {
      actions.remove(pendingDeleteId);
      if (state.selectedId === pendingDeleteId) {
        actions.select(null);
        window.location.hash = '';
      }
    }
    setPendingDeleteId(null);
    setShowConfirm(false);
  };

  const onCancelDelete = () => {
    setPendingDeleteId(null);
    setShowConfirm(false);
  };

  const selectedNote = state.notes.find(n => n.id === state.selectedId) || null;

  return (
    <div className="app-root">
      <TopBar onToggleSidebar={() => setShowSidebar(s => !s)} />
      <div className="app-body">
        <Sidebar
          visible={showSidebar}
          filter={state.filter}
          onFilterChange={(value) => actions.setFilter(value)}
          section={state.section}
          onSectionChange={(section) => actions.setSection(section)}
          onNewNote={onNewNote}
        />
        <main className="main-content" aria-live="polite">
          <div className="content-grid">
            <NotesList
              notes={state.filtered}
              selectedId={state.selectedId}
              onSelect={onSelectNote}
              onToggleFavorite={(id) => actions.toggleFavorite(id)}
              section={state.section}
              filter={state.filter}
            />
            <NoteEditor
              key={selectedNote ? selectedNote.id : 'new'}
              note={selectedNote}
              isCreating={state.isCreating}
              onSave={(payload) => {
                if (state.isCreating) {
                  const created = actions.create(payload.title, payload.body);
                  if (created?.id) {
                    window.location.hash = `#/note/${encodeURIComponent(created.id)}`;
                  } else {
                    window.location.hash = '';
                  }
                } else if (selectedNote) {
                  actions.update(selectedNote.id, payload.title, payload.body);
                }
              }}
              onDelete={() => {
                if (selectedNote) onDeleteRequest(selectedNote.id);
              }}
              onToggleFavorite={() => {
                if (selectedNote) actions.toggleFavorite(selectedNote.id);
              }}
              onCancel={() => {
                window.location.hash = '';
                actions.cancelCreate();
              }}
            />
          </div>
        </main>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Delete note?"
        message="This action cannot be undone. Are you sure you want to delete this note?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App root with NotesProvider to supply state and persistence. */
  useEffect(() => {
    // Ensure theme root variables are set (Ocean Professional)
    document.documentElement.style.setProperty('--bg', '#f9fafb');
  }, []);
  return (
    <NotesProvider service={new NotesService()}>
      <AppShell />
    </NotesProvider>
  );
}

export default App;
