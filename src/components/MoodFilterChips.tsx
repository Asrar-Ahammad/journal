import React from 'react';
import { MOODS, MoodType } from '@/lib/moods';
import { cn } from '@/lib/utils';

interface MoodFilterChipsProps {
  selectedMoods: MoodType[];
  onChange: (moods: MoodType[]) => void;
}

export function MoodFilterChips({ selectedMoods, onChange }: MoodFilterChipsProps) {
  const toggleMood = (mood: MoodType) => {
    if (selectedMoods.includes(mood)) {
      onChange(selectedMoods.filter(m => m !== mood));
    } else {
      onChange([...selectedMoods, mood]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground mr-1">Filter:</span>
      {Object.values(MOODS).map((mood) => {
        const isSelected = selectedMoods.includes(mood.id);
        return (
          <button
            key={mood.id}
            onClick={() => toggleMood(mood.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors shadow-sm cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected 
                ? "border-transparent bg-background" // If selected, base colors are overridden by inline styles or tailwind arbitrary
                : "bg-transparent border-input text-muted-foreground hover:bg-muted/50"
            )}
            style={isSelected ? {
              backgroundColor: `${mood.bgHex}20`, // 20% opacity background
              borderColor: `${mood.bgHex}50`,
              color: mood.bgHex
            } : {}}
          >
            <span className="mr-1.5">{mood.emoji}</span>
            {mood.label}
          </button>
        );
      })}
    </div>
  );
}
