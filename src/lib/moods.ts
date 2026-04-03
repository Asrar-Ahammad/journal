export type MoodType = 'happy' | 'sad' | 'anxious' | 'calm' | 'angry' | 'grateful' | 'excited' | 'neutral';

export interface MoodConfig {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgHex: string;
}

export const MOODS: Record<MoodType, MoodConfig> = {
  happy: {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    color: 'text-amber-500',
    bgHex: '#F59E0B',
  },
  sad: {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    color: 'text-blue-400',
    bgHex: '#60A5FA',
  },
  anxious: {
    id: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    color: 'text-violet-400',
    bgHex: '#A78BFA',
  },
  calm: {
    id: 'calm',
    label: 'Calm',
    emoji: '🌿',
    color: 'text-emerald-400',
    bgHex: '#34D399', /* Adjusted from 6EE7B7 to slightly fuller contrast in Tailwind defaults */
  },
  angry: {
    id: 'angry',
    label: 'Angry',
    emoji: '😤',
    color: 'text-red-400',
    bgHex: '#F87171',
  },
  grateful: {
    id: 'grateful',
    label: 'Grateful',
    emoji: '🙏',
    color: 'text-pink-300',
    bgHex: '#F9A8D4',
  },
  excited: {
    id: 'excited',
    label: 'Excited',
    emoji: '🎉',
    color: 'text-orange-400',
    bgHex: '#FB923C',
  },
  neutral: {
    id: 'neutral',
    label: 'Neutral',
    emoji: '😐',
    color: 'text-slate-400',
    bgHex: '#94A3B8',
  },
};
