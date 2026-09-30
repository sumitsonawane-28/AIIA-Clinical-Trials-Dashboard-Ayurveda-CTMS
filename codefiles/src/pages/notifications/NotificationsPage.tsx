import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  ShieldAlert,
  FileCheck2,
  CalendarCheck,
  TrendingUp,
  Filter,
  Check,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationsCount } = useData();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filteredNotifications = notifications.filter((n) => {
    const matchesType = typeFilter === 'ALL' || n.type === typeFilter;
    const matchesUnread = unreadOnly ? !n.isRead : true;
    return matchesType && matchesUnread;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'safety':
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'ctri':
      case 'ethics':
        return <FileCheck2 className="w-5 h-5 text-amber-500" />;
      case 'monitoring':
      case 'visit':
        return <CalendarCheck className="w-5 h-5 text-teal-600" />;
      case 'recruitment':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-serif">
            Regulatory & Operational Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated compliance deadlines, CTRI updates, ethics queries, and safety line-listings
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={() => markAllNotificationsRead()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          <span className="font-semibold text-slate-600 dark:text-slate-400">Filter Category:</span>
          {['ALL', 'safety', 'ctri', 'ethics', 'monitoring', 'recruitment'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                typeFilter === t
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Alerts' : t.toUpperCase()}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
          />
          <span>Show Unread Only ({unreadNotificationsCount})</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-900 dark:text-slate-100 font-serif">
            Active Alerts Archive ({filteredNotifications.length})
          </span>
          <span className="text-slate-400">
            Real-time automated clinical trials monitoring engine
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">All alerts resolved</p>
              <p className="text-xs">No pending notifications match the active filter criteria.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 transition-colors flex items-start gap-4 ${
                  !n.isRead
                    ? 'bg-teal-50/40 dark:bg-teal-950/20'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={n.severity}>{n.severity.toUpperCase()}</Badge>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(n.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-3">
                    {n.linkUrl && (
                      <button
                        onClick={() => {
                          markNotificationRead(n.id);
                          navigate(n.linkUrl);
                        }}
                        className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
                      >
                        Inspect Associated Record &rarr;
                      </button>
                    )}

                    {!n.isRead && (
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
