import { ElementType, PropsWithChildren } from 'react';
import clsx from 'clsx';

type BadgeVariant = 'solid' | 'outline';

interface BadgeProps extends PropsWithChildren {
  variant?: BadgeVariant;
  icon?: ElementType;
}

export function Badge({ variant = 'solid', icon: Icon, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
        variant === 'solid'
          ? 'bg-white/10 text-white shadow-glow'
          : 'border border-white/20 bg-white/5 text-white/70'
      )}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </span>
  );
}
