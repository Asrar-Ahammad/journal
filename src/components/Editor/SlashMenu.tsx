import React from 'react';
import { Type, Heading1, Heading2, Heading3, List, ListOrdered, TextQuote, Code, Minus } from 'lucide-react';
import { Block as BlockType } from '@/types/journal';

interface SlashMenuProps {
  visible: boolean;
  position: { top: number; left: number };
  onSelect: (type: BlockType['type']) => void;
  onClose: () => void;
}

const COMMANDS: { type: BlockType['type'], icon: React.ReactNode, label: string }[] = [
  { type: 'paragraph', icon: <Type size={16} />, label: 'Text' },
  { type: 'h1', icon: <Heading1 size={16} />, label: 'Heading 1' },
  { type: 'h2', icon: <Heading2 size={16} />, label: 'Heading 2' },
  { type: 'h3', icon: <Heading3 size={16} />, label: 'Heading 3' },
  { type: 'bullet', icon: <List size={16} />, label: 'Bulleted List' },
  { type: 'numbered', icon: <ListOrdered size={16} />, label: 'Numbered List' },
  { type: 'quote', icon: <TextQuote size={16} />, label: 'Quote' },
  { type: 'code', icon: <Code size={16} />, label: 'Code' },
  { type: 'divider', icon: <Minus size={16} />, label: 'Divider' },
];

export function SlashMenu({ visible, position, onSelect, onClose }: SlashMenuProps) {
  if (!visible) return null;

  return (
    <>
      {/* Invisible overlay just to catch clicks outside if needed, or we handle via editor blur */}
      <div 
        className="absolute z-50 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border w-48 overflow-hidden py-1"
        style={{ top: position.top, left: position.left }}
      >
        <div className="px-3 xl:px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Basic Blocks
        </div>
        {COMMANDS.map(cmd => (
          <button
            key={cmd.type}
            className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-muted focus:bg-muted outline-none transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onSelect(cmd.type);
            }}
          >
            <div className="bg-background border border-border p-1 rounded">
              {cmd.icon}
            </div>
            <span className="text-sm font-medium">{cmd.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
