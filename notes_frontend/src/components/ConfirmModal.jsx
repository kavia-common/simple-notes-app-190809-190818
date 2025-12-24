import React, { useEffect } from 'react';

// PUBLIC_INTERFACE
export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel
}) {
  /** Generic confirmation modal with Escape to cancel. */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onCancel?.();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') onConfirm?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal">
        <h3 id="confirm-title">{title}</h3>
        <div>{message}</div>
        <div className="actions">
          <button className="sec-btn" onClick={onCancel} autoFocus>
            {cancelText}
          </button>
          <button
            className={variant === 'danger' ? 'danger-btn' : 'primary-btn'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
