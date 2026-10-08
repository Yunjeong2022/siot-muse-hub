import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative z-10 w-full ${maxWidth} rounded-3xl bg-white p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-ink-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-ink-500 transition-colors hover:bg-sage-50 hover:text-ink-900"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
