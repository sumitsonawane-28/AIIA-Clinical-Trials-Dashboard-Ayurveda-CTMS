import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Users,
  Building2,
  TrendingUp,
  CalendarCheck,
  ShieldAlert,
  FileCheck2,
  CheckCheck,
  FileBarChart2,
  Bell,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Leaf,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse, mobile = false, onCloseMobile }: SidebarProps) {
  const { canAccess, role } = useAuth();
  const { unreadNotificationsCount } = useData();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
    { name: 'Studies', path: '/studies', icon: FlaskConical, module: 'studies' },
    { name: 'Participants', path: '/participants', icon: Users, module: 'participants' },
    { name: 'Research Sites', path: '/sites', icon: Building2, module: 'sites' },
    { name: 'Recruitment', path: '/recruitment', icon: TrendingUp, module: 'recruitment' },
    { name: 'Visits & Monitoring', path: '/visits', icon: CalendarCheck, module: 'visits' },
    { name: 'Safety & PV', path: '/safety', icon: ShieldAlert, module: 'safety', badge: 'SAE' },
    { name: 'Ethics & CTRI', path: '/regulatory', icon: FileCheck2, module: 'regulatory' },
    { name: 'Data Quality', path: '/data-quality', icon: CheckCheck, module: 'data_quality' },
    { name: 'Reports', path: '/reports', icon: FileBarChart2, module: 'reports' },
    { name: 'Alerts & Notifs', path: '/notifications', icon: Bell, module: 'notifications', count: unreadNotificationsCount },
    { name: 'Audit Trail', path: '/audit-trail', icon: History, module: 'audit_trail' },
    { name: 'Settings', path: '/settings', icon: Settings, module: 'settings' },
  ];

  const visibleItems = navItems.filter((item) => canAccess(item.module));

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-40 select-none',
        mobile ? 'w-72 h-full' : collapsed ? 'w-20' : 'w-64 min-h-screen'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-md shadow-teal-900/20">
            <Leaf className="w-5 h-5 text-emerald-200" />
          </div>
          {(!collapsed || mobile) && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-serif flex items-center gap-1.5">
                AIIA CTMS
                <span className="text-[10px] font-sans font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.2 rounded">
                  v2.6
                </span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                Ayurveda Clinical Trials
              </span>
            </div>
          )}
        </div>

        {!mobile && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Quick Action Button */}
      {(!collapsed || mobile) && canAccess('studies') && role !== 'regulator' && (
        <div className="p-3">
          <NavLink
            to="/studies/new"
            onClick={mobile ? onCloseMobile : undefined}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all hover:shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Clinical Study</span>
          </NavLink>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={mobile ? onCloseMobile : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative',
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold border border-teal-200/80 dark:border-teal-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                )
              }
              title={collapsed && !mobile ? item.name : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              {(!collapsed || mobile) && (
                <span className="flex-1 truncate">{item.name}</span>
              )}
              {(!collapsed || mobile) && item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {item.badge}
                </span>
              )}
              {(!collapsed || mobile) && item.count !== undefined && item.count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Ministry / Institute Footer */}
      {(!collapsed || mobile) && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-[11px] text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Ministry of Ayush
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500">
            Govt. of India • AIIA New Delhi
          </p>
        </div>
      )}
    </aside>
  );
}
