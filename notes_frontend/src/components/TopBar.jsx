import React from 'react';

// PUBLIC_INTERFACE
export default function TopBar({ onToggleSidebar }) {
  /** TopBar shows the app brand and a sidebar toggle on small screens. */
  return (
    <header className="topbar" role="banner">
      <div className="brand" aria-label="Simple Notes App">
        <div className="brand-accent" aria-hidden="true" />
        <div className="brand-title">Simple Notes</div>
      </div>
      <div className="topbar-actions">
        <button
          className="icon-btn"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          title="Toggle sidebar"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
