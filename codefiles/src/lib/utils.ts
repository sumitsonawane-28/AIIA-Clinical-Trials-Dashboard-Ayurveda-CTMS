import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: string): { bg: string; text: string; border: string; ring: string } {
  const s = status.toLowerCase();
  if (s.includes('active') || s.includes('approved') || s.includes('compliant') || s.includes('registered') || s.includes('resolved') || s.includes('on track')) {
    return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', ring: 'ring-emerald-500/20' };
  }
  if (s.includes('recruiting') || s.includes('in progress') || s.includes('scheduled')) {
    return { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800', ring: 'ring-teal-500/20' };
  }
  if (s.includes('pending') || s.includes('at risk') || s.includes('due') || s.includes('under review') || s.includes('major')) {
    return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', ring: 'ring-amber-500/20' };
  }
  if (s.includes('behind') || s.includes('critical') || s.includes('overdue') || s.includes('suspended') || s.includes('sae') || s.includes('life') || s.includes('death')) {
    return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', ring: 'ring-rose-500/20' };
  }
  if (s.includes('completed') || s.includes('closed')) {
    return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', ring: 'ring-blue-500/20' };
  }
  return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700', ring: 'ring-slate-400/20' };
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'admin': return 'Admin / AIIA Management';
    case 'pi': return 'Principal Investigator (PI)';
    case 'coordinator': return 'Study Coordinator';
    case 'monitor': return 'Clinical Research Monitor';
    case 'ethics': return 'Institutional Ethics Committee';
    case 'safety': return 'Pharmacovigilance Officer';
    case 'regulator': return 'Regulatory Auditor (Read-Only)';
    default: return role;
  }
}
