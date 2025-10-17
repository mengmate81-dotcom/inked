import React from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--color-backdrop)] z-40 flex justify-center items-center backdrop-blur" onClick={onClose}>
      <div 
        className="bg-[var(--color-surface-primary)] rounded-2xl shadow-2xl w-full max-w-sm m-4 flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-scale-in backdrop-blur-lg texture-paper"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards', boxShadow: `0 25px 50px -12px var(--color-shadow)` }}
      >
        <div className="flex justify-between items-center p-3 border-b border-[var(--color-border-primary)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
          <button onClick={onClose} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-primary)]">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};