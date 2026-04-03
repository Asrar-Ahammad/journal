import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '@/types/journal';

const STORAGE_KEY = 'luminae_journals';

export function useJournals() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage initially
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as JournalEntry[];
          // Sort by newest first
          parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setJournals(parsed);
        } catch (e) {
          console.error("Failed to parse journals from local storage", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const saveToStorage = (data: JournalEntry[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };

  const addJournal = useCallback((entry: JournalEntry) => {
    setJournals(prev => {
      const updated = [entry, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateJournal = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setJournals(prev => {
      const updated = prev.map(journal => {
        if (journal.id === id) {
          return { ...journal, ...updates, updatedAt: new Date().toISOString() };
        }
        return journal;
      });
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const deleteJournal = useCallback((id: string) => {
    setJournals(prev => {
      const updated = prev.filter(journal => journal.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const getJournal = useCallback((id: string) => {
    return journals.find(j => j.id === id);
  }, [journals]);

  return {
    journals,
    isLoaded,
    addJournal,
    updateJournal,
    deleteJournal,
    getJournal,
  };
}
