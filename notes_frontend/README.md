# Simple Notes App (Frontend)

A lightweight React single-page notes app with an Ocean Professional theme. Create, view, edit, favorite, search, and delete notes. Data persists locally in your browser.

## Features

- Single-page layout: Top bar, collapsible left sidebar, and main content
- Notes list with title preview, updated time, and favorite star
- Create, edit, delete notes with a confirmation modal
- Favorites filter and full-text search (title/body)
- Keyboard accessibility: Enter to save, Esc to cancel modal, focus outlines
- State management via Context + useReducer
- Persistence via `localStorage` (key: `notes.v1`)
- Hash-based routing for note selection (`#/note/:id` and `#/new`)
- Ocean Professional theme: primary `#2563EB`, secondary `#F59E0B`, error `#EF4444`

## Environment

- Optional: `REACT_APP_API_BASE` (if provided, the service is ready for a future backend; now runs in local mode)
- The app does not fail if env variables are undefined.

## Run

- `npm start` — development at http://localhost:3000
- `npm test` — runs basic unit tests
- `npm run build` — production build

## Data Persistence

Notes are stored in `localStorage` under the key `notes.v1`. Clearing browser storage will remove the notes.

## Project Structure

- `src/styles/theme.css` — theme tokens and utilities
- `src/store/NotesContext.jsx` — context, reducer, actions
- `src/services/NotesService.js` — data access (localStorage), backend stubs
- `src/components/*` — UI components
- `src/helpers/*` — small utilities

## Tests

- `src/services/NotesService.test.js` — localStorage behavior coverage
- Component tests can be added in `src/components/*.test.jsx` (TODO).

## Accessibility

- Focusable list items and proper aria labels
- Escape to close modal, Enter/Cmd/Ctrl+Enter to save
