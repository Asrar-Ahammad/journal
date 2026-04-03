import { useEffect, useRef, useState } from 'react';

export function useAutoSave<T>(value: T, delay: number, onSave: (val: T) => void) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    setSaveState('saving');
    
    const handler = setTimeout(() => {
      onSave(value);
      setSaveState('saved');
      
      // Reset to idle after a bit
      setTimeout(() => setSaveState('idle'), 2000);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, onSave]);

  return saveState;
}
