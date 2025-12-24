import { NotesService } from './NotesService';

describe('NotesService (localStorage)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('creates and lists notes', () => {
    const svc = new NotesService();
    const n = svc.createNote({ title: 'Hello', body: 'World' });
    expect(n.id).toBeDefined();
    const all = svc.listNotes();
    expect(all.length).toBe(1);
    expect(all[0].title).toBe('Hello');
  });

  test('updates a note', () => {
    const svc = new NotesService();
    const n = svc.createNote({ title: 'A', body: 'B' });
    const updated = svc.updateNote(n.id, { title: 'A2', body: 'B2' });
    expect(updated.title).toBe('A2');
    const fetched = svc.getNote(n.id);
    expect(fetched.body).toBe('B2');
  });

  test('deletes a note', () => {
    const svc = new NotesService();
    const n = svc.createNote({ title: 'X', body: 'Y' });
    svc.deleteNote(n.id);
    expect(svc.listNotes().length).toBe(0);
  });

  test('toggle favorite', () => {
    const svc = new NotesService();
    const n = svc.createNote({ title: 'Fav', body: '' });
    expect(svc.getNote(n.id).favorite).toBe(false);
    svc.toggleFavorite(n.id);
    expect(svc.getNote(n.id).favorite).toBe(true);
  });

  test('search finds substring', () => {
    const svc = new NotesService();
    svc.createNote({ title: 'Alpha', body: 'First' });
    svc.createNote({ title: 'Beta', body: 'Second' });
    const res = svc.search('alp');
    expect(res.length).toBe(1);
    expect(res[0].title).toBe('Alpha');
  });
});
