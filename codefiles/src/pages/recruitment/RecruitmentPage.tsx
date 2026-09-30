import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Target,
  ArrowUpRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useData } from '../../context/DataContext';

export function RecruitmentPage() {
  const { studies, sites, participants } = useData();
  const [selectedStudyId, setSelectedStudyId] = useState('ALL');

  // Aggregated or Selected Study Data
  const targetStudy = selectedStudyId === 'ALL' ? null : studies.find((s) => s.id === selectedStudyId);

  const totalTarget = targetStudy
    ? targetStudy.targetEnrollment
    : studies.reduce((sum, s) => sum + s.targetEnrollment, 0);

  const totalEnrolled = targetStudy
    ? targetStudy.currentEnrollment
    : studies.reduce((sum, s) => sum + s.currentEnrollment, 0);

  const totalScreened = targetStudy
    ? targetStudy.screenedCount
    : studies.reduce((sum, s) => sum + s.screenedCount, 0);

  const totalEligible = targetStudy
    ? targetStudy.eligibleCount
    : studies.reduce((sum, s) => sum + s.eligibleCount, 0);

  const totalCompleted = targetStudy
    ? targetStudy.completedCount
    : studies.reduce((sum, s) => sum + s.completedCount, 0);

  const totalDropouts = targetStudy
    ? targetStudy.dropoutCount
    : studies.reduce((sum, s) => sum + s.dropoutCount, 0);

  const screenFailureRate = totalScreened
    ? Math.round(((totalScreened - totalEligible) / totalScreened) * 100)
    : 0;

  const dropoutRate = totalEnrolled
    ? Math.round((totalDropouts / totalEnrolled) * 100)
    : 0;

  const recruitmentProgress = Math.round((totalEnrolled / (totalTarget || 1)) * 100);

  // Simulated Monthly Cumulative Recruitment Trend
  const monthlyTrendData = [
    { month: 'Oct 2025', projected: 45, actual: 40 },
    { month: 'Nov 2025', projected: 110, actual: 95 },
    { month: 'Dec 2025', projected: 190, actual: 180 },
    { month: 'Jan 2026', projected: 280, actual: 260 },
    { month: 'Feb 2026', projected: 390, actual: 365 },
    { month: 'Mar 2026', projected: 490, actual: 442 },
  ];

  // Site breakdown comparison
  const siteAccrualData = sites.map((st) => ({
    name: st.name.split(' ')[0] + ' ' + (st.city || ''),
    enrolled: st.currentEnrollmentTotal,
    target: st.targetEnrollmentTotal,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
            Participant Recruitment & Accrual Funnel
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end accrual analytics, screening conversion rates, and multi-site enrollment trajectory
          </p>
        </div>

        {/* Study Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-slate-400">View Trial:</label>
          <select
            value={selectedStudyId}
            onChange={(e) => setSelectedStudyId(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 py-2 px-3 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">Entire Portfolio (All Studies)</option>
            {studies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}: {s.shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recruitment Pipeline Funnel Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Screened</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-serif mt-1 block">
            {totalScreened}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Screen failure: {screenFailureRate}%</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Eligible</span>
          <span className="text-2xl font-extrabold text-teal-800 dark:text-teal-300 font-serif mt-1 block">
            {totalEligible}
          </span>
          <span className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 block">
            {Math.round((totalEligible / (totalScreened || 1)) * 100)}% conversion
          </span>
        </div>

        <div className="bg-teal-50 dark:bg-teal-950/40 rounded-3xl p-5 border border-teal-200 dark:border-teal-800 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 block">
            3. Enrolled & Dosed
          </span>
          <span className="text-2xl font-extrabold text-teal-900 dark:text-teal-100 font-serif mt-1 block">
            {totalEnrolled}
          </span>
          <span className="text-[11px] text-teal-700 dark:text-teal-300 mt-1 block">
            Target: {totalTarget} ({recruitmentProgress}%)
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">4. Completed Study</span>
          <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-serif mt-1 block">
            {totalCompleted}
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block">Protocol completed</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">5. Dropouts / Lost</span>
          <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-serif mt-1 block">
            {totalDropouts}
          </span>
          <span className="text-[11px] text-rose-600 mt-1 block">Dropout rate: {dropoutRate}%</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trajectory Monthly Curve */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                Recruitment Trajectory: Projected vs Actual
              </h3>
              <p className="text-xs text-slate-500">Cumulative participant enrollment rate</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              90.2% of target rate
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  fillOpacity={0}
                  name="Projected Target"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#0f766e"
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  name="Actual Enrolled"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Site comparison */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Accrual Distribution by Site
            </h3>
            <p className="text-xs text-slate-500">Site-level contribution to sample capacity</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={siteAccrualData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={75} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="enrolled" fill="#0f766e" name="Enrolled" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="#cbd5e1" name="Target" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
