import { MoodType } from '@/lib/moods';

export interface Block {
  id: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'quote' | 'code' | 'divider';
  content: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  blocks: Block[];
  mood: MoodType;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
