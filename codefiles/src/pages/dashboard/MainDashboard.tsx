import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Activity,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  CalendarClock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Building2,
  AlertCircle,
  PlusCircle,
  Download,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../lib/utils';

export function MainDashboard() {
  const { studies, sites, participants, safetyReports, regulatoryItems, auditLogs, visits } = useData();
  const { role, user } = useAuth();
  const navigate = useNavigate();

  // Metrics calculation
  const totalStudies = studies.length;
  const activeStudies = studies.filter((s) => s.status === 'Active' || s.status === 'Recruiting').length;
  const recruitingStudies = studies.filter((s) => s.status === 'Recruiting').length;
  const completedStudies = studies.filter((s) => s.status === 'Completed').length;
  const behindScheduleStudies = studies.filter((s) => s.health === 'Behind Schedule' || s.health === 'Critical Attention').length;
  const pendingEthics = studies.filter((s) => s.ethicsStatus !== 'Approved').length;
  const pendingCtri = studies.filter((s) => s.ctriStatus === 'Update Due in <30 Days' || s.ctriStatus === 'Action Required').length;
  const pendingSAE = safetyReports.filter((r) => r.isSerious && r.status !== 'Resolved').length;

  // Chart 1: Recruitment Target vs Actual
  const recruitmentData = studies.map((s) => ({
    name: s.id,
    shortTitle: s.shortTitle.split(' ')[0] + ' ' + (s.shortTitle.split(' ')[1] || ''),
    target: s.targetEnrollment,
    enrolled: s.currentEnrollment,
    rate: Math.round((s.currentEnrollment / (s.targetEnrollment || 1)) * 100),
  }));

  // Chart 2: Study Status Distribution
  const statusCounts: Record<string, number> = {};
  studies.forEach((s) => {
    statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const STATUS_COLORS: Record<string, string> = {
    Recruiting: '#0d9488', // teal-600
    Active: '#059669', // emerald-600
    Planned: '#3b82f6', // blue-500
    Completed: '#64748b', // slate-500
    'Ethics Pending': '#f59e0b', // amber-500
    Suspended: '#e11d48', // rose-600
  };

  // Chart 3: Safety Overview
  const safetyByType = [
    { type: 'AE (Mild/Mod)', count: safetyReports.filter((r) => r.eventType.includes('AE') && !r.isSerious).length },
    { type: 'SAE (Serious)', count: safetyReports.filter((r) => r.isSerious).length },
    { type: 'ADR (Suspected)', count: safetyReports.filter((r) => r.eventType.includes('ADR')).length },
    { type: 'Resolved', count: safetyReports.filter((r) => r.status === 'Resolved').length },
    { type: 'Pending Action', count: safetyReports.filter((r) => r.status !== 'Resolved').length },
  ];

  // Chart 4: Site Performance Recruitment
  const sitePerformanceData = sites.map((st) => ({
    name: st.code,
    fullName: st.name,
    target: st.targetEnrollmentTotal,
    enrolled: st.currentEnrollmentTotal,
    qualityScore: st.dataQualityScore,
  }));

  // Upcoming Milestones across active studies
  const allMilestones = studies.flatMap((s) =>
    s.milestones.map((m) => ({
      ...m,
      studyId: s.id,
      studyTitle: s.shortTitle,
    }))
  );
  const upcomingMilestones = allMilestones
    .filter((m) => m.status === 'In Progress' || m.status === 'Upcoming' || m.status === 'Overdue')
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-900 to-teal-950 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>All India Institute of Ayurveda</span>
            <span>•</span>
            <span>Central CTMS Portfolio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif">
            Clinical Trials Monitoring Command Center
          </h1>
          <p className="text-xs text-teal-100/80 mt-1 max-w-2xl">
            Live surveillance of national multi-centric Ayurveda clinical trials, participant accrual, CTRI compliance, and pharmacovigilance signals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/studies/new')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Initiate Study</span>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white text-xs font-semibold border border-emerald-700/60 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Behind Schedule / Regulatory Alert Callout if any */}
      {(behindScheduleStudies > 0 || pendingSAE > 0 || pendingCtri > 0) && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Action Items Requiring Principal Investigator & Regulatory Attention:
              </span>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                {behindScheduleStudies > 0 && `${behindScheduleStudies} study recruitment delayed; `}
                {pendingSAE > 0 && `${pendingSAE} active Serious Adverse Event (SAE) reports; `}
                {pendingCtri > 0 && `${pendingCtri} CTRI milestone updates due.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/studies?filter=behind_schedule')}
            className="text-amber-900 dark:text-amber-200 font-bold hover:underline shrink-0"
          >
            Review Flagged Studies &rarr;
          </button>
        </div>
      )}

      {/* 8 Clickable Real-Time KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Portfolio Key Performance Indicators (Click to Filter)
          </h2>
          <span className="text-xs text-slate-400">Real-time sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Studies"
            value={totalStudies}
            icon={FlaskConical}
            subtext="All AYU registered protocols"
            variant="teal"
            onClick={() => navigate('/studies')}
          />
          <StatCard
            label="Active Studies"
            value={activeStudies}
            icon={Activity}
            subtext="On-going clinical evaluation"
            variant="emerald"
            onClick={() => navigate('/studies?status=Active')}
          />
          <StatCard
            label="Recruiting Studies"
            value={recruitingStudies}
            icon={Users}
            subtext="Open participant screening"
            variant="teal"
            onClick={() => navigate('/studies?status=Recruiting')}
          />
          <StatCard
            label="Completed Studies"
            value={completedStudies}
            icon={CheckCircle2}
            subtext="Hard-locked & reported"
            variant="blue"
            onClick={() => navigate('/studies?status=Completed')}
          />
          <StatCard
            label="Behind Schedule"
            value={behindScheduleStudies}
            icon={AlertTriangle}
            subtext="Recruitment or SIV delay"
            variant="rose"
            onClick={() => navigate('/studies?filter=behind_schedule')}
            badge={behindScheduleStudies > 0 ? 'Action Req' : undefined}
          />
          <StatCard
            label="Pending Ethics"
            value={pendingEthics}
            icon={FileCheck}
            subtext="IEC approvals or queries"
            variant="amber"
            onClick={() => navigate('/regulatory?tab=ethics')}
          />
          <StatCard
            label="CTRI Actions Due"
            value={pendingCtri}
            icon={CalendarClock}
            subtext="Half-yearly mandatory logs"
            variant="amber"
            onClick={() => navigate('/regulatory?tab=ctri')}
          />
          <StatCard
            label="Pending SAE Reports"
            value={pendingSAE}
            icon={ShieldAlert}
            subtext="Expedited 24h/14d review"
            variant="rose"
            onClick={() => navigate('/safety?filter=pending')}
            badge={pendingSAE > 0 ? 'Urgent' : undefined}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recruitment Chart (Target vs Actual) */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                Recruitment Accrual: Target vs Enrolled
              </h3>
              <p className="text-xs text-slate-500">
                Current participant count compared with target trial power
              </p>
            </div>
            <button
              onClick={() => navigate('/recruitment')}
              className="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline self-start sm:self-auto"
            >
              Detailed funnel &rarr;
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruitmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(val: any, name: any) => [val, name === 'target' ? 'Target Sample' : 'Enrolled Patients']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="target" fill="#cbd5e1" name="Target Sample" radius={[6, 6, 0, 0]} />
                <Bar dataKey="enrolled" fill="#0f766e" name="Enrolled Patients" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Status Distribution (Donut Chart) */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Trial Lifecycle Distribution
            </h3>
            <p className="text-xs text-slate-500">Active portfolio phase allocation</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[item.name] || '#94a3b8' }}
                />
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {item.name}:
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts & Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Site Performance Bar Chart */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                Site Recruitment Performance
              </h3>
              <p className="text-xs text-slate-500">Recruitment across 5 institutional medical centers</p>
            </div>
            <button
              onClick={() => navigate('/sites')}
              className="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline"
            >
              All sites &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sitePerformanceData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, name: any) => [val, name === 'enrolled' ? 'Enrolled' : 'Target']}
                />
                <Bar dataKey="enrolled" fill="#047857" name="Enrolled" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="#cbd5e1" name="Target" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safety Signals Breakdown */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                Pharmacovigilance & Safety Signals
              </h3>
              <p className="text-xs text-slate-500">Adverse events classification & resolution</p>
            </div>
            <button
              onClick={() => navigate('/safety')}
              className="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline"
            >
              Safety Desk &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safetyByType} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#e11d48" radius={[6, 6, 0, 0]}>
                  {safetyByType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.type.includes('SAE') ? '#be123c' : entry.type.includes('Resolved') ? '#059669' : '#f59e0b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Milestones & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Milestones */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-teal-600" />
              <span>Upcoming Protocol Milestones</span>
            </h3>
            <span className="text-xs text-slate-400">Surveillance list</span>
          </div>

          <div className="space-y-3">
            {upcomingMilestones.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/studies/${m.studyId}`)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                      {m.studyId}
                    </span>
                    <Badge variant={m.status}>{m.status}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                    {m.title}
                  </p>
                  <p className="text-[11px] text-slate-400">{m.studyTitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(m.targetDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Trail Snippet */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Recent Clinical Audit Trail</span>
            </h3>
            <button
              onClick={() => navigate('/audit-trail')}
              className="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline"
            >
              Full log &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {log.userName} ({(log.role || log.userRole || 'USER').toUpperCase()})
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {log.details}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {log.module}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.recordId}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
