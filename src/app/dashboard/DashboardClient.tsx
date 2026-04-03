"use client"

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useJournals } from '@/hooks/useJournals';
import { MoodType } from '@/lib/moods';
import { JournalCard } from '@/components/JournalCard';
import { MoodFilterChips } from '@/components/MoodFilterChips';
import { DatePickerWithRange } from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, BookHeart, UserRound } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface DashboardClientProps {
  user: { name?: string | null, email?: string | null }
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const { journals, isLoaded } = useJournals();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<MoodType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredJournals = useMemo(() => {
    return journals.filter(entry => {
      const matchSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.blocks.some(b => b.content.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchMood = selectedMoods.length === 0 || selectedMoods.includes(entry.mood);
      
      let matchDate = true;
      if (dateRange?.from) {
        const entryDate = new Date(entry.createdAt);
        entryDate.setHours(0, 0, 0, 0);
        
        if (dateRange.to) {
          const from = new Date(dateRange.from); from.setHours(0, 0, 0, 0);
          const to = new Date(dateRange.to); to.setHours(23, 59, 59, 999);
          matchDate = entryDate >= from && entryDate <= to;
        } else {
          const from = new Date(dateRange.from); from.setHours(0, 0, 0, 0);
          matchDate = entryDate.getTime() === from.getTime();
        }
      }
      
      return matchSearch && matchMood && matchDate;
    });
  }, [journals, searchQuery, selectedMoods, dateRange]);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-heading font-medium text-xl">
            <BookHeart className="text-amber-500" />
            <span>Luminae</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/journal/new">
              <Button className="rounded-full gap-2 shadow-sm h-10 px-4">
                <Plus size={18} />
                <span className="hidden sm:inline">New Entry</span>
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none rounded-full overflow-hidden focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="border shadow-sm h-10 w-10">
                  <AvatarFallback className="bg-primary/5 text-primary font-medium">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="font-medium text-sm text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <UserRound className="mr-2" size={16}/> Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive/10 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12 flex flex-col gap-8">
        
        {/* Filters */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" size={18} />
              <Input 
                type="text" 
                placeholder="Search your thoughts..." 
                className="pl-10 h-12 rounded-2xl bg-white shadow-sm border-border/60 focus-visible:ring-amber-500/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
          <div className="flex items-center">
            <MoodFilterChips selectedMoods={selectedMoods} onChange={setSelectedMoods} />
          </div>
        </div>

        {/* Journals Grid */}
        {!isLoaded ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        ) : filteredJournals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {filteredJournals.map((journal, index) => (
              <div 
                key={journal.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <JournalCard entry={journal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 animate-in fade-in">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-muted/50 flex items-center justify-center rotate-3">
              <BookHeart className="text-muted-foreground/40 w-12 h-12 -rotate-3" />
            </div>
            <h3 className="text-2xl font-heading font-medium text-foreground mb-2">
              {searchQuery || selectedMoods.length ? "No matching entries" : "Your mind is a blank canvas"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {searchQuery || selectedMoods.length 
                ? "Try adjusting your search or filters to find what you're looking for." 
                : "It's quiet here. Start capturing your thoughts, feelings, and memories today."}
            </p>
            {!(searchQuery || selectedMoods.length) && (
              <Link href="/journal/new">
                <Button size="lg" className="rounded-full shadow-sm">
                  Write your first entry
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
