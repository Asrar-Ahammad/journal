"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useJournals } from '@/hooks/useJournals';
import { useAutoSave } from '@/hooks/useAutoSave';
import { BlockEditor } from '@/components/Editor/BlockEditor';
import { MoodSelector } from '@/components/MoodSelector';
import { Button } from '@/components/ui/button';
import { JournalEntry, Block as BlockType } from '@/types/journal';
import { MOODS, MoodType } from '@/lib/moods';
import { ArrowLeft, Trash2, CheckCircle2, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface EditorClientProps {
  initialId?: string;
}

export default function EditorClient({ initialId }: EditorClientProps) {
  const router = useRouter();
  const { journals, isLoaded, addJournal, updateJournal, deleteJournal, getJournal } = useJournals();
  
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [initFinished, setInitFinished] = useState(false);

  // Load existing or initialize new
  useEffect(() => {
    if (!isLoaded) return;
    
    if (initialId) {
      const existing = getJournal(initialId);
      if (existing) {
        setEntry(existing);
      } else {
        toast.error("Journal not found");
        router.replace('/dashboard');
      }
    } else {
      // Setup new blank entry state
      setEntry({
        id: uuidv4(),
        title: '',
        mood: 'neutral',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        blocks: [{ id: uuidv4(), type: 'paragraph', content: '' }]
      });
    }
    setInitFinished(true);
  }, [isLoaded, initialId, getJournal, router]);

  // We only run the autosave if it's not a fresh blank entry with no changes.
  // We'll track purely the changes. 
  // Actually, useAutoSave will trigger after delay if entry changes.
  const handleSave = (currentEntry: JournalEntry | null) => {
    if (!currentEntry) return;
    
    // Check if it exists in store
    const isNew = !getJournal(currentEntry.id);
    
    // Don't save if totally empty
    const isEmpty = !currentEntry.title.trim() && currentEntry.blocks.every(b => !b.content.trim());
    if (isEmpty && isNew) return; 
    
    if (isNew) {
      addJournal(currentEntry);
    } else {
      updateJournal(currentEntry.id, {
        title: currentEntry.title,
        mood: currentEntry.mood,
        blocks: currentEntry.blocks
      });
    }
  };

  const saveState = useAutoSave(entry, 1500, handleSave);

  if (!initFinished || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const currentMood = MOODS[entry.mood];
  
  const wordCount = entry.blocks
    .map(b => b.content)
    .join(' ')
    .split(/\s+/)
    .filter(w => w.length > 0).length;

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      if (getJournal(entry.id)) {
        deleteJournal(entry.id);
        toast.success("Entry deleted");
      }
      router.replace('/dashboard');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{ backgroundColor: `${currentMood.bgHex}08` }} // Very subtle background tint
    >
      {/* Dynamic Top Bar */}
      <header 
        className="sticky top-0 z-20 backdrop-blur-md border-b transition-colors duration-500"
        style={{ 
          backgroundColor: `${currentMood.bgHex}15`,
          borderColor: `${currentMood.bgHex}30`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background/50 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            
            <MoodSelector 
              selected={entry.mood} 
              onSelect={(mood) => setEntry(prev => ({ ...prev!, mood }))} 
            />
            
            <div className="hidden sm:block text-sm text-foreground/60">
              {format(new Date(entry.createdAt), "MMMM d, yyyy")}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium flex items-center gap-2 text-foreground/70">
              {saveState === 'saving' && <><Loader2 size={14} className="animate-spin" /> Saving...</>}
              {saveState === 'saved' && <><CheckCircle2 size={14} className="text-emerald-500" /> Saved</>}
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full">
              <Trash2 size={18} />
            </Button>
            <Button 
              className="rounded-full shadow-sm gap-2"
              onClick={() => { handleSave(entry); toast.success("Saved dynamically") }}
            >
              <Save size={16} /> <span className="hidden sm:inline">Force Save</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Main */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="mb-12">
          <input
            type="text"
            value={entry.title}
            onChange={(e) => setEntry(prev => ({ ...prev!, title: e.target.value }))}
            placeholder="Untitled..."
            className="w-full text-5xl md:text-6xl font-heading font-medium tracking-tight bg-transparent border-none outline-none placeholder:text-muted-foreground/30 text-foreground"
          />
        </div>
        
        <BlockEditor 
          initialBlocks={entry.blocks}
          onChange={(blocks) => setEntry(prev => ({ ...prev!, blocks }))}
        />
      </main>

      {/* Footer Meta */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 bg-background/80 backdrop-blur-md border-t border-border z-10 text-center text-xs text-muted-foreground font-medium">
        <span className="inline-flex gap-4">
          <span>{wordCount} words</span>
          <span>{readingTime} min read</span>
        </span>
      </footer>
    </div>
  );
}
