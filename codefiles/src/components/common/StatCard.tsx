import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  subtext?: string;
  trend?: string;
  variant?: 'emerald' | 'amber' | 'rose' | 'teal' | 'blue' | 'slate';
  onClick?: () => void;
  badge?: string;
  active?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  subtext,
  variant = 'teal',
  onClick,
  badge,
  active = false,
}: StatCardProps) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/60',
      iconBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/60',
      iconBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      text: 'text-teal-700 dark:text-teal-400',
      border: 'border-teal-200 dark:border-teal-800/60',
      iconBg: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800/60',
      iconBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    },
    slate: {
      bg: 'bg-slate-50 dark:bg-slate-900/30',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-800',
      iconBg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    },
  };

  const scheme = colorMap[variant];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border p-5 transition-all duration-200 text-left',
        onClick ? 'cursor-pointer hover:shadow-md hover:border-teal-500/50 hover:-translate-y-0.5' : '',
        active ? 'ring-2 ring-teal-600 border-teal-500 shadow-md' : 'border-slate-200 dark:border-slate-800'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-serif">
              {value}
            </span>
            {badge && (
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium border', scheme.bg, scheme.text, scheme.border)}>
                {badge}
              </span>
            )}
          </div>
          {subtext && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {subtext}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl shrink-0', scheme.iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {onClick && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-teal-700 dark:text-teal-400">
          <span>View records</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
