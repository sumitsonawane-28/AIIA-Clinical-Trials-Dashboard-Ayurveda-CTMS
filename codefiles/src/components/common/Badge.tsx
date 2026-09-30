import React from 'react';
import { getStatusColor, cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant, className, dot = true }: BadgeProps) {
  const text = typeof children === 'string' ? children : variant || '';
  const colors = getStatusColor(text);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap tracking-wide',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            colors.text.replace('text-', 'bg-')
          )}
        />
      )}
      {children}
    </span>
  );
}
