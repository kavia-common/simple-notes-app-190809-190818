import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { NotesService } from '../services/NotesService';

const NotesStateContext = createContext(null);
const NotesDispatchContext = createContext(null);

const initialState = {
  notes: [],
  selectedId: null,
  filter: '',
  section: 'all', // 'all' | 'favorites'
  isCreating: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD': {
      return {
        ...state,
        notes: action.notes || []
      };
    }
    case 'SELECT': {
      return {
        ...state,
        selectedId: action.id ?? null,
        isCreating: false
      };
    }
    case 'START_CREATE': {
      return { ...state, isCreating: true, selectedId: null };
    }
    case 'CANCEL_CREATE': {
      return { ...state, isCreating: false };
    }
    case 'CREATE': {
      return {
        ...state,
        notes: [action.note, ...state.notes],
        selectedId: action.note.id,
        isCreating: false
      };
    }
    case 'UPDATE': {
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === action.note.id ? action.note : n))
      };
    }
    case 'DELETE': {
      const nextNotes = state.notes.filter((n) => n.id !== action.id);
      const selectedId = state.selectedId === action.id ? null : state.selectedId;
      return { ...state, notes: nextNotes, selectedId };
    }
    case 'TOGGLE_FAVORITE': {
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === action.id ? { ...n, favorite: !n.favorite, updatedAt: Date.now() } : n))
      };
    }
    case 'SET_FILTER': {
      return { ...state, filter: action.filter ?? '' };
    }
    case 'SET_SECTION': {
      return { ...state, section: action.section || 'all' };
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function NotesProvider({ children, service }) {
  /**
   * PUBLIC_INTERFACE
   * Provides app state and actions, persisting to localStorage via NotesService.
   */
  const [state, dispatch] = useReducer(reducer, initialState);
  const svc = useMemo(() => service || new NotesService(), [service]);

  // Persist notes when they change
  useEffect(() => {
    if (state.notes) {
      svc.persist(state.notes);
    }
  }, [state.notes, svc]);

  const load = useCallback(() => {
    const notes = svc.listNotes();
    dispatch({ type: 'LOAD', notes });
  }, [svc]);

  const select = useCallback((id) => dispatch({ type: 'SELECT', id }), []);
  const startCreate = useCallback(() => dispatch({ type: 'START_CREATE' }), []);
  const cancelCreate = useCallback(() => dispatch({ type: 'CANCEL_CREATE' }), []);

  const create = useCallback((title, body) => {
    const note = svc.createNote({ title, body });
    dispatch({ type: 'CREATE', note });
    return note;
  }, [svc]);

  const update = useCallback((id, title, body) => {
    const note = svc.updateNote(id, { title, body });
    dispatch({ type: 'UPDATE', note });
    return note;
  }, [svc]);

  const remove = useCallback((id) => {
    svc.deleteNote(id);
    dispatch({ type: 'DELETE', id });
  }, [svc]);

  const toggleFavorite = useCallback((id) => {
    svc.toggleFavorite(id);
    dispatch({ type: 'TOGGLE_FAVORITE', id });
  }, [svc]);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', filter });
  }, []);

  const setSection = useCallback((section) => {
    dispatch({ type: 'SET_SECTION', section });
  }, []);

  const filtered = useMemo(() => {
    const q = (state.filter || '').trim().toLowerCase();
    let arr = state.notes;
    if (state.section === 'favorites') {
      arr = arr.filter((n) => n.favorite);
    }
    if (!q) return arr;
    return arr.filter((n) => (n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q));
  }, [state.notes, state.filter, state.section]);

  const value = useMemo(() => ({
    state: { ...state, filtered },
    actions: {
      load,
      select,
      startCreate,
      cancelCreate,
      create,
      update,
      remove,
      toggleFavorite,
      setFilter,
      setSection
    }
  }), [state, filtered, load, select, startCreate, cancelCreate, create, update, remove, toggleFavorite, setFilter, setSection]);

  return (
    <NotesStateContext.Provider value={value.state}>
      <NotesDispatchContext.Provider value={value.actions}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access state and actions. */
  const state = React.useContext(NotesStateContext);
  const actions = React.useContext(NotesDispatchContext);
  if (!state || !actions) {
    throw new Error('useNotes must be used within NotesProvider');
    }
  return { state, actions };
}
