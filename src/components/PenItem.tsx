import React, { useRef } from 'react';
import type { Pen, Ink } from '../types';
import { InkDropIcon, CleanIcon, PencilSquareIcon, TrashIcon } from './icons';
import { BrandLogo } from './BrandLogo';

interface PenItemProps {
  pen: Pen;
  ink: Ink | undefined;
  onInk: (pen: Pen) => void;
  onClean: (penId: string) => void;
  onEdit: (pen: Pen) => void;
  onDelete: (penId: string) => void;
  onLogoClick: (brandName: string) => void;
  customLogo?: string | null;
}

export const PenItem: React.FC<PenItemProps> = ({ pen, ink, onInk, onClean, onEdit, onDelete, customLogo, onLogoClick }) => {
  const nibDetails = [pen.nib.size, pen.nib.material, pen.nib.features].filter(Boolean).join(' ');
  const contentRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    currentTranslateX: 0,
  });

  const onDragStart = (clientX: number) => {
    dragState.current.isDragging = true;
    dragState.current.startX = clientX;
    if (contentRef.current) {
        contentRef.current.style.transition = 'none';
    }
  };

  const onDrag = (clientX: number) => {
    if (!dragState.current.isDragging || !contentRef.current) return;
    const diff = clientX - dragState.current.startX;
    const newTranslateX = dragState.current.currentTranslateX + diff;
    if (newTranslateX <= 0 && newTranslateX > -145) { // Clamp drag
      contentRef.current.style.transform = `translateX(${newTranslateX}px)`;
    }
  };

  const onDragEnd = () => {
    if (!dragState.current.isDragging || !contentRef.current) return;
    dragState.current.isDragging = false;
    contentRef.current.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
    const currentTransform = new DOMMatrix(getComputedStyle(contentRef.current).transform).m41;

    if (currentTransform < -72) { // Snap open if dragged past halfway
      contentRef.current.style.transform = 'translateX(-144px)';
      dragState.current.currentTranslateX = -144;
    } else { // Snap closed
      contentRef.current.style.transform = 'translateX(0px)';
      dragState.current.currentTranslateX = 0;
    }
  };

  const closeActions = () => {
    if (contentRef.current) {
      contentRef.current.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
      contentRef.current.style.transform = 'translateX(0px)';
      dragState.current.currentTranslateX = 0;
    }
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => onDragStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => onDrag(e.touches[0].clientX);
  const handleTouchEnd = () => onDragEnd();

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => onDragStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => onDrag(e.clientX);
  const handleMouseUp = () => onDragEnd();
  const handleMouseLeave = () => { if(dragState.current.isDragging) onDragEnd() };


  return (
    <div className="relative mb-2 w-full overflow-hidden rounded-xl bg-[var(--color-surface-primary)] texture-paper" style={{boxShadow: `0 1px 2px 0 var(--color-shadow)`}}>
      <div className="absolute top-0 right-0 h-full flex z-0">
        <button 
          onClick={() => { onEdit(pen); closeActions(); }} 
          className="w-[72px] h-full flex flex-col items-center justify-center bg-blue-500 text-white transition-colors hover:bg-blue-600"
          aria-label={`编辑 ${pen.brand} ${pen.model}`}
        >
          <PencilSquareIcon className="w-5 h-5"/>
          <span className="text-xs mt-1">编辑</span>
        </button>
        <button 
          onClick={() => { onDelete(pen.id); closeActions(); }} 
          className="w-[72px] h-full flex flex-col items-center justify-center bg-[var(--color-text-danger)] text-white transition-colors hover:bg-rose-500"
          aria-label={`删除 ${pen.brand} ${pen.model}`}
        >
          <TrashIcon className="w-5 h-5"/>
          <span className="text-xs mt-1">删除</span>
        </button>
      </div>
      
      <div 
        ref={contentRef}
        className="relative bg-[var(--color-surface-primary-opaque)] p-3 cursor-grab active:cursor-grabbing z-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <button 
              onClick={() => onLogoClick(pen.brand)} 
              className="flex-shrink-0 focus:outline-none rounded-full focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-primary-opaque)]"
              aria-label={`编辑 ${pen.brand} 标志`}
            >
                <BrandLogo brandName={pen.brand} className="w-9 h-9 flex-shrink-0" customLogo={customLogo} />
            </button>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--color-text-primary)] truncate text-sm">{pen.brand}</p>
              <p className="text-[var(--color-text-secondary)] truncate text-sm">{pen.model}</p>
              <p className="text-xs text-[var(--color-text-subtle)] mt-1 truncate">{nibDetails}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            {ink ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full border border-[var(--color-border-primary)]" style={{ backgroundColor: ink.color }}></div>
                <div>
                  <p className="font-medium text-xs text-[var(--color-text-secondary)]">{ink.brand}</p>
                  <p className="text-xs text-[var(--color-text-subtle)]">{ink.name}</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[var(--color-text-subtle)] italic">已清洗</div>
            )}
          </div>
        </div>

        {pen.nib.writingFeel && (
          <p className="text-xs text-[var(--color-text-subtle)] mt-2 italic">“{pen.nib.writingFeel}”</p>
        )}

        <div className="flex justify-end space-x-2 mt-2 pt-2 border-t border-[var(--color-border-secondary)]">
          {ink ? (
            <button onClick={() => onClean(pen.id)} className="flex items-center space-x-1 text-xs text-[var(--color-text-danger)] font-medium px-2.5 py-1 rounded-lg hover:bg-[var(--color-button-danger-hover-bg)] transition-colors">
              <CleanIcon className="w-3.5 h-3.5" />
              <span>清洗</span>
            </button>
          ) : (
            <button onClick={() => onInk(pen)} className="flex items-center space-x-1 text-xs text-[var(--color-text-accent)] font-medium px-2.5 py-1 rounded-lg hover:bg-[var(--color-button-subtle-hover-bg)] transition-colors">
              <InkDropIcon className="w-3.5 h-3.5" />
              <span>上墨</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};