import React, { useState } from 'react';
import { MOODS, MoodType } from '@/lib/moods';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  selected: MoodType;
  onSelect: (mood: MoodType) => void;
  readOnly?: boolean;
}

export function MoodSelector({ selected, onSelect, readOnly }: MoodSelectorProps) {
  const currentMood = MOODS[selected];
  const [open, setOpen] = useState(false);

  if (readOnly) {
    return (
      <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm text-sm font-medium", currentMood.color, "bg-background")}>
        <span>{currentMood.emoji}</span>
        <span>{currentMood.label}</span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* @ts-expect-error asChild exists on PopoverTrigger but ts throws an error in this specific version */}
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("rounded-full pr-4 pl-3 gap-2 shadow-sm font-medium hover:bg-muted/50 border-border/60 transition-colors", currentMood.color)}>
          <span className="text-base">{currentMood.emoji}</span>
          <span>{currentMood.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-2 rounded-2xl" align="end">
        <div className="grid grid-cols-2 gap-1">
          {Object.values(MOODS).map((mood) => (
            <button
              key={mood.id}
              onClick={() => {
                onSelect(mood.id);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted outline-none focus:bg-muted",
                selected === mood.id ? mood.color : "text-muted-foreground",
                selected === mood.id && "bg-muted/50"
              )}
            >
              <span className="text-lg">{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
