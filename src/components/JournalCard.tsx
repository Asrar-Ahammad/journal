import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { JournalEntry } from '@/types/journal';
import { MOODS } from '@/lib/moods';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface JournalCardProps {
  entry: JournalEntry;
}

export function JournalCard({ entry }: JournalCardProps) {
  const mood = MOODS[entry.mood];
  
  // Extract text from blocks
  const contentPreview = entry.blocks
    .map(b => b.content)
    .filter(c => c.trim().length > 0)
    .join(' ');
  
  const wordCount = contentPreview.split(/\s+/).filter(w => w.length > 0).length;

  return (
    <Link href={`/journal/${entry.id}`} className="block group">
      <Card 
        className={cn(
          "h-full overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md border-border/60 bg-card rounded-2xl relative",
        )}
      >
        {/* Top Accent Stripe */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5 transition-colors"
          style={{ backgroundColor: mood.bgHex }}
        />
        
        <CardHeader className="pt-6 pb-2">
          <div className="flex justify-between items-start gap-4 mb-2">
            <Badge 
              variant="secondary" 
              className="rounded-full px-2.5 py-0.5 font-medium border-0 shadow-sm"
              style={{ 
                backgroundColor: `${mood.bgHex}15`, 
                color: mood.bgHex 
              }}
            >
              <span className="mr-1">{mood.emoji}</span>
              {mood.label}
            </Badge>
            <time className="text-xs text-muted-foreground font-medium">
              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
            </time>
          </div>
          <CardTitle className="font-heading text-xl leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {entry.title || "Untitled Entry"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mt-1">
            {contentPreview || "No content written yet."}
          </p>
        </CardContent>
        
        <CardFooter className="pt-0 mt-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
