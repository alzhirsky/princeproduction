import type { ElementType } from 'react';

interface AdminStatCardProps {
  label: string;
  value: string;
  trend: string;
  description: string;
  icon: ElementType<{ className?: string }>;
}

export function AdminStatCard({ label, value, trend, description, icon: Icon }: AdminStatCardProps) {
  return (
    <article className="glass glass-hover space-y-4 p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm uppercase tracking-[0.2em] text-white/60">{label}</span>
        <Icon className="h-5 w-5 text-white/60" />
      </div>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-sm text-success">{trend}</p>
      <p className="text-sm text-white/60">{description}</p>
    </article>
  );
}
