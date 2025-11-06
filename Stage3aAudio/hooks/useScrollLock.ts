// hooks/useScrollLock.ts
import { useLayoutEffect } from 'react';

export function useScrollLock(isLocked: boolean) {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling on mount
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]); // Only re-run if isLocked changes
}