import clsx from 'clsx';

interface AvatarProps {
  name: string;
  accent?: string;
}

const colors = ['#5B8CFF', '#3ddc97', '#f8c537', '#ff5f6d'];

export function Avatar({ name, accent }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const color = accent ?? colors[name.length % colors.length];

  return (
    <span
      aria-hidden
      className={clsx(
        'flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white shadow-glow',
        'border border-white/20'
      )}
      style={{ background: color }}
    >
      {initials}
    </span>
  );
}
