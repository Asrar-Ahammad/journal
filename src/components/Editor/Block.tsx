import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block as BlockType } from '@/types/journal';
import { cn } from '@/lib/utils';

interface BlockProps {
  block: BlockType;
  autoFocus?: boolean;
  onChange: (id: string, content: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>, id: string) => void;
  onSelect: () => void;
  listIndex?: number;
}

export function Block({ block, autoFocus, onChange, onKeyDown, onSelect, listIndex }: BlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (autoFocus && contentRef.current) {
      contentRef.current.focus();
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== block.content) {
      contentRef.current.textContent = block.content;
    }
  }, [block.content]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(block.id, e.currentTarget.textContent || '');
  };

  const getPlaceholder = () => {
    if (block.type === 'h1') return "Heading 1";
    if (block.type === 'h2') return "Heading 2";
    if (block.type === 'h3') return "Heading 3";
    if (block.type === 'quote') return "Empty quote";
    if (block.type === 'code') return "const sum = (a, b) => a + b;";
    return "Type '/' for commands";
  };

  if (block.type === 'divider') {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className={cn("py-4 cursor-pointer outline-none group flex items-center relative", isDragging && "z-10 opacity-50")}
        onClick={onSelect}
        onKeyDown={(e) => onKeyDown(e, block.id)}
        tabIndex={0}
      >
        <div 
          className="opacity-0 group-hover:opacity-100 absolute -left-6 cursor-grab text-muted-foreground transition-opacity"
          contentEditable={false}
          {...attributes}
          {...listeners}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </div>
        <hr className="w-full border-t border-border group-hover:border-foreground/30 transition-colors" />
      </div>
    );
  }

  return (
    <div 
      className={cn("relative group flex items-start -ml-6 pl-6", isDragging && "z-10 opacity-50")}
      ref={setNodeRef}
      style={style}
    >
      <div 
        className="opacity-0 group-hover:opacity-100 absolute left-0 top-1.5 cursor-grab text-muted-foreground transition-opacity"
        contentEditable={false}
        {...attributes}
        {...listeners}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </div>

      <div className={cn("flex-1 min-w-0 flex", block.type === 'quote' && 'border-l-4 border-foreground pl-4 py-1', block.type === 'code' && 'bg-slate-900 text-slate-50 p-4 rounded-md font-mono text-sm')}>
        {block.type === 'bullet' && <span className="mr-3 font-bold">•</span>}
        {block.type === 'numbered' && <span className="mr-3 font-bold">{listIndex ?? 1}.</span>}

        <div
          ref={contentRef}
          className={cn(
            "flex-1 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground whitespace-pre-wrap",
            block.type === 'h1' && "text-4xl font-heading font-medium mt-6 mb-2",
            block.type === 'h2' && "text-2xl font-heading font-medium mt-5 mb-2",
            block.type === 'h3' && "text-xl font-heading font-medium mt-4 mb-2",
            block.type === 'paragraph' && "text-base min-h-[1.5rem] leading-relaxed",
            block.type === 'quote' && "italic text-muted-foreground",
          )}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={(e) => onKeyDown(e, block.id)}
          onFocus={onSelect}
          data-placeholder={getPlaceholder()}
        />
      </div>
    </div>
  );
}
