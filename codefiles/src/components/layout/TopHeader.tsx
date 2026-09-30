import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  UserCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DEMO_ACCOUNTS } from '../../services/authService';
import { UserRole } from '../../types';
import { getRoleDisplayName, formatDate } from '../../lib/utils';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export function TopHeader({ onToggleSidebar, onOpenMobileMenu }: TopHeaderProps) {
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead, studies, participants, sites, safetyReports } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('aiia_ctms_dark') === 'true';
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme toggle
  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('aiia_ctms_dark', String(nextMode));
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global search filtering
  const filteredStudies = searchQuery.trim()
    ? studies.filter(
        (s) =>
          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredParticipants = searchQuery.trim()
    ? participants.filter(
        (p) =>
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.siteName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredSites = searchQuery.trim()
    ? sites.filter(
        (st) =>
          st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          st.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredSafety = searchQuery.trim()
    ? safetyReports.filter(
        (sr) =>
          sr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sr.eventDescription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const hasSearchResults =
    filteredStudies.length > 0 ||
    filteredParticipants.length > 0 ||
    filteredSites.length > 0 ||
    filteredSafety.length > 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 md:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div ref={searchRef} className="relative w-full max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search studies, participants, sites, safety records..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 py-2 pl-10 pr-4 text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute left-0 mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
              {!hasSearchResults ? (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  No clinical records found matching "{searchQuery}"
                </div>
              ) : (
                <div className="py-2 divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudies.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Studies ({filteredStudies.length})
                      </div>
                      {filteredStudies.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            navigate(`/studies/${s.id}`);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group"
                        >
                          <div>
                            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 mr-2">
                              {s.id}
                            </span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                              {s.shortTitle}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{s.status}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredParticipants.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Participants ({filteredParticipants.length})
                      </div>
                      {filteredParticipants.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigate('/participants');
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 mr-2">
                              {p.id}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">
                              {p.siteName} ({p.currentVisitStatus})
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{p.studyId}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredSafety.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Safety Events ({filteredSafety.length})
                      </div>
                      {filteredSafety.map((sf) => (
                        <button
                          key={sf.id}
                          onClick={() => {
                            navigate('/safety');
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mr-2">
                              {sf.id}
                            </span>
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              {sf.eventType} - {sf.participantId}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{sf.severity}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Role Switcher, Notifications, Theme, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/70 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100/70 transition-all text-xs font-semibold"
            title="Switch demo role to view RBAC differences"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wide">
              Role:
            </span>
            <span className="font-bold">{getRoleDisplayName(role).split('/')[0]}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 text-teal-600" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Role Switcher (RBAC)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a persona to test route & operational permissions:
                </p>
              </div>
              <div className="mt-1 space-y-1">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    onClick={() => {
                      switchRole(acc.role as UserRole);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex flex-col ${
                      role === acc.role
                        ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {acc.label}
                      </span>
                      {role === acc.role && (
                        <span className="text-[10px] text-teal-600 font-bold bg-teal-100 dark:bg-teal-900 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {acc.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Flyout */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50 animate-in fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Clinical Alerts
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-xs text-teal-700 hover:text-teal-800 dark:text-teal-400 font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications or alerts.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        navigate(n.linkUrl);
                        setShowNotifDropdown(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start gap-3 ${
                        !n.isRead ? 'bg-teal-50/30 dark:bg-teal-950/20' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.severity === 'critical' ? (
                          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {formatDate(n.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifDropdown(false);
                  }}
                  className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                >
                  View all alerts & regulatory deadlines &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Avatar & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex flex-col text-right hidden md:block">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {user?.name || 'AIIA Investigator'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {user?.department?.split('(')[0] || 'Central Clinical Trial Cell'}
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Sign out of CTMS"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
