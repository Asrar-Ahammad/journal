import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Block as BlockComponent } from './Block';
import { SlashMenu } from './SlashMenu';
import { Block as BlockType } from '@/types/journal';

interface BlockEditorProps {
  initialBlocks: BlockType[];
  onChange: (blocks: BlockType[]) => void;
}

export function BlockEditor({ initialBlocks, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<BlockType[]>(
    initialBlocks.length > 0 ? initialBlocks : [{ id: uuidv4(), type: 'paragraph', content: '' }]
  );
  
  const [focusedId, setFocusedId] = useState<string | null>(null);
  
  // Slash Menu State
  const [slashMenu, setSlashMenu] = useState({
    visible: false,
    blockId: '',
    top: 0,
    left: 0
  });

  const editorRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Notify parent of block changes
    onChange(blocks);
  }, [blocks, onChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(t => t.id === active.id);
        const newIndex = items.findIndex(t => t.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx === -1) return prev;
      
      const newBlocks = [...prev];
      newBlocks[idx] = { ...newBlocks[idx], content };
      
      // Check for slash command
      if (content === '/') {
        setSlashMenu({
          visible: true,
          blockId: id,
          top: (idx * 30) + 40,
          left: 40
        });
      } else {
        setSlashMenu(s => ({ ...s, visible: false }));
      }
      
      return newBlocks;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
    const idx = blocks.findIndex(b => b.id === id);
    if (idx === -1) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (slashMenu.visible) {
        setSlashMenu(s => ({ ...s, visible: false }));
        return;
      }

      const newId = uuidv4();
      
      if (blocks[idx].content === '' && blocks[idx].type !== 'paragraph') {
        updateBlockType(id, 'paragraph');
        return;
      }

      const currentType = blocks[idx].type;
      const nextType = (currentType === 'bullet' || currentType === 'numbered') ? currentType : 'paragraph';

      const newBlock: BlockType = { id: newId, type: nextType, content: '' };
      const newBlocks = [...blocks];
      newBlocks.splice(idx + 1, 0, newBlock);
      
      setBlocks(newBlocks);
      setFocusedId(newId);
    } 
    else if (e.key === 'Backspace' && blocks[idx].content === '') {
      if (idx === 0 && blocks.length === 1) {
        if (blocks[0].type !== 'paragraph') updateBlockType(id, 'paragraph');
        return; 
      }
      e.preventDefault();
      
      if (blocks[idx].type !== 'paragraph') {
        updateBlockType(id, 'paragraph');
        return;
      }

      const newBlocks = [...blocks];
      newBlocks.splice(idx, 1);
      
      setBlocks(newBlocks);
      setFocusedId(blocks[idx - 1]?.id || newBlocks[0]?.id || null);
      setSlashMenu(s => ({ ...s, visible: false }));
    }
    else if (e.key === 'ArrowUp' && idx > 0) {
      if (!slashMenu.visible) setFocusedId(blocks[idx - 1].id);
    }
    else if (e.key === 'ArrowDown' && idx < blocks.length - 1) {
      if (!slashMenu.visible) setFocusedId(blocks[idx + 1].id);
    }
  };

  const updateBlockType = (id: string, type: BlockType['type']) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, type, content: '' } : b));
    setSlashMenu({ visible: false, blockId: '', top: 0, left: 0 });
    setFocusedId(id);
  };

  useEffect(() => {
    const handleClick = () => { if (slashMenu.visible) setSlashMenu(s => ({ ...s, visible: false })); };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [slashMenu.visible]);

  return (
    <div className="relative w-full max-w-3xl mx-auto pb-32" ref={editorRef}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => {
            let listIndex = undefined;
            if (block.type === 'numbered') {
              listIndex = 1;
              for (let i = index - 1; i >= 0; i--) {
                if (blocks[i].type === 'numbered') listIndex++;
                else break;
              }
            }

            return (
              <BlockComponent
                key={block.id}
                block={block}
                autoFocus={focusedId === block.id}
                onChange={updateBlock}
                onKeyDown={handleKeyDown}
                onSelect={() => setFocusedId(block.id)}
                listIndex={listIndex}
              />
            );
          })}
        </SortableContext>
      </DndContext>

      {slashMenu.visible && (
        <SlashMenu
          visible={slashMenu.visible}
          position={{ top: slashMenu.top, left: slashMenu.left }}
          onSelect={(type) => updateBlockType(slashMenu.blockId, type)}
          onClose={() => setSlashMenu(s => ({ ...s, visible: false }))}
        />
      )}
    </div>
  );
}
