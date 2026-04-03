import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />

      <div className="max-w-2xl text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-border shadow-sm text-sm font-medium text-muted-foreground backdrop-blur-sm mx-auto mb-4">
          <Sparkles size={14} className="text-amber-500" />
          <span>A clear space for a clear mind</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl flex flex-col font-heading font-medium tracking-tight text-[#1A1A2E]">
          <span className="italic opacity-90 text-4xl md:text-6xl mb-2">Welcome to</span>
          Luminae.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl mx-auto font-light">
          Your thoughts, beautifully kept. A serene journal tailored to your feelings, securely stored just for you.
        </p>

        <div className="pt-8">
          <Link href="/auth/signin">
            <Button size="lg" className="rounded-full text-lg h-14 px-8 shadow-sm hover:shadow-md transition-all group">
              Start Writing
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-24 flex gap-3 text-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
        <span title="Happy">😊</span>
        <span title="Calm">🌿</span>
        <span title="Grateful">🙏</span>
        <span title="Excited">🎉</span>
      </div>
    </main>
  );
}
