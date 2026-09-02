'use client';

import { LoaderCircle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading data...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex min-h-40 flex-col items-center justify-center gap-3 text-secondary ${className}`} role="status" aria-live="polite">
      <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
      <span className="text-xs font-semibold text-muted-foreground">{message}</span>
    </div>
  );
}
