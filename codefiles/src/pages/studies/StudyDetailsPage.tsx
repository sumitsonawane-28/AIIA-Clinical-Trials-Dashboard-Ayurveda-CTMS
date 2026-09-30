import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  FileCheck2,
  ShieldAlert,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Plus,
  Search,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';

export function StudyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    studies,
    participants,
    safetyReports,
    protocolDeviations,
    dataQueries,
    auditLogs,
    visits,
    documents,
    updateStudy,
    addProtocolDeviation,
    addDocument,
  } = useData();
  const { role } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [showAddDeviationModal, setShowAddDeviationModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  // New Deviation State
  const [newDev, setNewDev] = useState({
    participantId: '',
    siteName: '',
    description: '',
    severity: 'Minor' as const,
    actionTaken: '',
  });

  // New Doc State
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Protocol Amendment',
    version: '1.1',
  });

  const study = studies.find((s) => s.id === id);

  if (!study) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Trial not found
        </h2>
        <p className="text-xs text-slate-500 mt-1">Study identifier {id} is not registered.</p>
        <button
          onClick={() => navigate('/studies')}
          className="mt-4 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  // Linked Entities
  const studyParticipants = participants.filter((p) => p.studyId === study.id);
  const studySafety = safetyReports.filter((r) => r.studyId === study.id);
  const studyDeviations = (protocolDeviations || []).filter((d: any) => d.studyId === study.id);
  const studyQueries = (dataQueries || []).filter((q: any) => q.studyId === study.id);
  const studyAuditLogs = auditLogs.filter((l: any) => (l.recordId === study.id || l.studyId === study.id || l.entityId === study.id));
  const studyVisits = visits.filter((v: any) => v.studyId === study.id || studyParticipants.some((p) => p.id === v.participantId));
  const studyDocs = documents.filter((d) => d.studyId === study.id);

  const recruitmentRate = Math.round(
    (study.currentEnrollment / (study.targetEnrollment || 1)) * 100
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'protocol', label: 'Protocol' },
    { id: 'ethics', label: 'Ethics (IEC)' },
    { id: 'ctri', label: 'CTRI Registry' },
    { id: 'sites', label: `Sites (${study.sites.length})` },
    { id: 'participants', label: `Participants (${studyParticipants.length})` },
    { id: 'recruitment', label: 'Recruitment Funnel' },
    { id: 'visits', label: `Visits (${studyVisits.length})` },
    { id: 'deviations', label: `Deviations (${studyDeviations.length})` },
    { id: 'data_quality', label: `Data Queries (${studyQueries.length})` },
    { id: 'safety', label: `Safety / PV (${studySafety.length})` },
    { id: 'milestones', label: `Milestones (${study.milestones.length})` },
    { id: 'documents', label: `Documents (${studyDocs.length})` },
    { id: 'audit_trail', label: 'Audit Trail' },
  ];

  const handleSaveDeviation = (e: React.FormEvent) => {
    e.preventDefault();
    addProtocolDeviation({
      id: `dev-${Date.now()}`,
      studyId: study.id,
      siteId: study.sites[0]?.siteId || 'SITE-DEL-01',
      participantId: newDev.participantId || studyParticipants[0]?.id || 'N/A',
      siteName: newDev.siteName || study.sites[0]?.siteName || 'AIIA New Delhi',
      deviationCategory: 'Eligibility / Treatment Dosing',
      description: newDev.description,
      severity: newDev.severity as any,
      correctiveAction: newDev.actionTaken,
      status: 'Open',
      dateIdentified: new Date().toISOString().split('T')[0],
      reportedBy: 'Study Coordinator',
    });
    setShowAddDeviationModal(false);
    setNewDev({ participantId: '', siteName: '', description: '', severity: 'Minor', actionTaken: '' });
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      id: `doc-${Date.now()}`,
      studyId: study.id,
      name: newDoc.title,
      title: newDoc.title,
      category: (newDoc.category as any) || 'Protocol',
      version: newDoc.version,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Principal Investigator',
      fileSize: '1.4 MB',
      status: 'Approved',
    });
    setShowAddDocModal(false);
    setNewDoc({ title: '', category: 'Protocol', version: '1.1' });
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/studies')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studies Registry</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Hero Study Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {study.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {study.phase}
              </span>
              <Badge variant={study.status}>{study.status}</Badge>
              <Badge variant={study.health}>{study.health}</Badge>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {study.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formulation: <span className="font-semibold text-slate-700 dark:text-slate-300">{study.formulationName}</span> • PI: <span className="font-semibold text-slate-700 dark:text-slate-300">{study.principalInvestigator}</span>
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accrual</span>
              <span className="text-base font-extrabold text-teal-800 dark:text-teal-300 font-serif">
                {study.currentEnrollment}/{study.targetEnrollment}
              </span>
              <span className="text-[10px] block text-slate-500">{recruitmentRate}% target</span>
            </div>
            <div className="border-x border-slate-200 dark:border-slate-700 px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sites</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-serif">
                {study.sites.length}
              </span>
              <span className="text-[10px] block text-slate-500">Active centers</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Safety</span>
              <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-serif">
                {studySafety.filter((s) => s.isSerious).length} SAE
              </span>
              <span className="text-[10px] block text-slate-500">{studySafety.length} total</span>
            </div>
          </div>
        </div>

        {/* 14 Tabs Bar (Horizontal scrolling) */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 dark:border-slate-800 mt-6 pt-3 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Administrative & Protocol Summary
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Study Identifier</span>
                <span className="font-mono font-bold text-teal-800 dark:text-teal-300">{study.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Protocol Number</span>
                <span className="font-mono font-medium">{study.protocolNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Design</span>
                <span className="font-medium">{study.studyType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Intervention Category</span>
                <span className="font-medium">{study.interventionType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Sponsor</span>
                <span className="font-medium text-right max-w-xs">{study.sponsor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Principal Investigator</span>
                <span className="font-medium">{study.principalInvestigator}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Trial Timeline</span>
                <span className="font-medium">{formatDate(study.startDate)} to {formatDate(study.expectedEndDate)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Accrual & Funnel Health
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Enrollment Completion</span>
                  <span className="font-bold text-teal-800 dark:text-teal-300">{recruitmentRate}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-700 rounded-full"
                    style={{ width: `${Math.min(recruitmentRate, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Screened</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
                    {study.screenedCount}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligible</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
                    {study.eligibleCount}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                    {study.completedCount}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Dropouts / Lost</span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400 font-serif">
                    {study.dropoutCount}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
                <p className="font-semibold text-xs">IEC / CTRI Status</p>
                <p className="text-[11px] mt-0.5">
                  Institutional clearance valid through {formatDate(study.iecExpiryDate)}. Next mandatory CTRI log update due on {formatDate(study.ctriNextUpdateDeadline)}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Protocol */}
      {activeTab === 'protocol' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif mb-2">
              Primary Objectives
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {study.objectives || 'To evaluate the efficacy and safety profile of the Ayurvedic intervention in comparison with standard active care.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif mb-2">
              Primary Outcome Measure
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                {study.primaryOutcome}
              </span>
              <p className="text-slate-500">
                Assessed at baseline, interim follow-up visits, and day of final study completion.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif mb-2">
              Secondary Outcome Measures
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {study.secondaryOutcomes || 'Quality of life, blood biochemistry, serum biomarker variations, and tolerability indices.'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif mb-2">
              Dosage & Administration Regimen
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {study.formulationName} administered strictly adhering to classical Ayurvedic dosage (Matra) and adjuvant (Anupana) directives.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ethics */}
      {activeTab === 'ethics' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                Institutional Ethics Committee (IEC) Clearance
              </h3>
              <p className="text-slate-400">Compliant with ICMR 2017 & GCP Guidelines</p>
            </div>
            <Badge variant={study.ethicsStatus}>{study.ethicsStatus}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-slate-400 font-medium block">Ethics Body</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">
                {study.iecName}
              </span>
              <span className="text-[11px] text-slate-500 block">Approval Ref: {study.iecApprovalNumber}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-slate-400 font-medium block">Clearance Period</span>
              <div className="flex justify-between">
                <span>Approved Date:</span>
                <span className="font-semibold">{formatDate(study.iecApprovalDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Expiry Date:</span>
                <span className="font-bold text-amber-600">{formatDate(study.iecExpiryDate)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: CTRI */}
      {activeTab === 'ctri' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                Clinical Trials Registry - India (ICMR - NIMS)
              </h3>
              <p className="text-slate-400">National mandatory public trial registry verification</p>
            </div>
            <Badge variant={study.ctriStatus}>{study.ctriStatus}</Badge>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 font-medium block">CTRI Registration Number</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm font-bold text-teal-800 dark:text-teal-300">
                  {study.ctriNumber || 'Registration In Process'}
                </span>
                {study.ctriNumber && (
                  <a
                    href={`http://ctri.nic.in/Clinicaltrials/pmaindet2.php?trialid=${study.ctriNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-600 hover:text-teal-800"
                    title="View on CTRI Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Next Mandatory Half-Yearly Update</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block mt-1">
                {formatDate(study.ctriNextUpdateDeadline)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Sites */}
      {activeTab === 'sites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Participating Clinical Sites
            </h3>
            <span className="text-xs text-slate-500">{study.sites.length} allocated centers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {study.sites.map((st) => (
              <div
                key={st.siteId}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-teal-800 dark:text-teal-300">
                      {st.siteId}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {st.siteName}
                    </h4>
                    <p className="text-slate-500 mt-1">Site PI: {st.investigatorName}</p>
                  </div>
                  <Badge variant={st.status}>{st.status}</Badge>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Recruitment</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {st.currentEnrollment} / {st.targetEnrollment}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-teal-700 rounded-full"
                      style={{
                        width: `${Math.min(
                          Math.round((st.currentEnrollment / (st.targetEnrollment || 1)) * 100),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Participants */}
      {activeTab === 'participants' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Enrolled Study Participants ({studyParticipants.length})
            </h3>
            <button
              onClick={() => navigate('/participants')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Full Participant Directory &rarr;
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Subject ID</th>
                  <th className="p-3">Age/Gender</th>
                  <th className="p-3">Research Site</th>
                  <th className="p-3">Enrollment Date</th>
                  <th className="p-3">Visit Status</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studyParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No participants registered for this study yet.
                    </td>
                  </tr>
                ) : (
                  studyParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-teal-700">{p.id}</td>
                      <td className="p-3">
                        {p.age} y / {p.gender}
                      </td>
                      <td className="p-3">{p.siteName}</td>
                      <td className="p-3">{formatDate(p.enrollmentDate)}</td>
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                        {p.currentVisitStatus}
                      </td>
                      <td className="p-3">
                        <Badge variant={p.status || p.screeningStatus || 'Enrolled'}>
                          {p.status || p.screeningStatus || 'Enrolled'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Recruitment Funnel */}
      {activeTab === 'recruitment' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
            Study Accrual Funnel
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Screened</span>
              <span className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                {study.screenedCount}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">100% of pipeline</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligible</span>
              <span className="text-xl font-bold font-serif text-teal-800 dark:text-teal-300">
                {study.eligibleCount}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {Math.round((study.eligibleCount / (study.screenedCount || 1)) * 100)}% screening yield
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 block">
                Enrolled
              </span>
              <span className="text-xl font-bold font-serif text-teal-900 dark:text-teal-100">
                {study.currentEnrollment}
              </span>
              <span className="text-[10px] text-teal-700 dark:text-teal-300 block mt-1">
                Target: {study.targetEnrollment}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
              <span className="text-xl font-bold font-serif text-emerald-700 dark:text-emerald-400">
                {study.completedCount}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Protocol finished</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lost / Dropouts</span>
              <span className="text-xl font-bold font-serif text-rose-600 dark:text-rose-400">
                {study.dropoutCount}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Withdrawals</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Protocol Deviations */}
      {activeTab === 'deviations' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                Protocol Deviations ({studyDeviations.length})
              </h3>
              <p className="text-xs text-slate-400">
                Good Clinical Practice (GCP) deviation logs & CAPA actions
              </p>
            </div>
            {role !== 'regulator' && (
              <button
                onClick={() => setShowAddDeviationModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Deviation</span>
              </button>
            )}
          </div>

          <div className="p-4 space-y-3 text-xs">
            {studyDeviations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No protocol deviations logged for this trial. Excellent compliance!
              </div>
            ) : (
              studyDeviations.map((d: any) => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-800 dark:text-teal-300">
                        {d.id}
                      </span>
                      <Badge variant={d.severity}>{d.severity}</Badge>
                      <span className="text-slate-500 font-semibold">{d.deviationCategory || d.type}</span>
                    </div>
                    <Badge variant={d.status}>{d.status}</Badge>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200">{d.description}</p>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-slate-100">Corrective Action (CAPA):</strong>{' '}
                    {d.correctiveAction || d.actionTaken}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Site: {d.siteName || d.siteId} • Subject: {d.participantId}</span>
                    <span>Reported: {formatDate(d.dateIdentified || d.reportedDate)} by {d.reportedBy || 'CRA'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 9: Safety */}
      {activeTab === 'safety' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Pharmacovigilance & Safety Surveillance ({studySafety.length})
            </h3>
            <button
              onClick={() => navigate('/safety')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Pharmacovigilance Desk &rarr;
            </button>
          </div>

          <div className="p-4 space-y-3 text-xs">
            {studySafety.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Zero adverse events or toxicity signals recorded for this study.
              </div>
            ) : (
              studySafety.map((sf) => (
                <div
                  key={sf.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                        {sf.id}
                      </span>
                      <Badge variant={sf.eventType}>{sf.eventType}</Badge>
                      <Badge variant={sf.severity}>{sf.severity}</Badge>
                    </div>
                    <Badge variant={sf.status}>{sf.status}</Badge>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {sf.eventDescription}
                  </p>
                  <div className="text-[11px] text-slate-500">
                    Causality: <span className="font-semibold text-slate-800 dark:text-slate-200">{sf.causalityAyurveda || sf.causalityAyurvedaDrug || 'Pending'}</span> • Action: {sf.actionTaken}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 10: Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
            Key Protocol Milestones & Deadlines
          </h3>

          <div className="space-y-3">
            {study.milestones.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{m.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Target Date: {formatDate(m.targetDate)}{' '}
                    {m.completedDate && `• Completed on: ${formatDate(m.completedDate)}`}
                  </p>
                </div>
                <Badge variant={m.status}>{m.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 11: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Trial Regulatory Dossier & Documents ({studyDocs.length})
            </h3>
            {role !== 'regulator' && (
              <button
                onClick={() => setShowAddDocModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
            )}
          </div>

          <div className="p-4 space-y-2 text-xs">
            {studyDocs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No documents uploaded.</div>
            ) : (
              studyDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{doc.title || doc.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {doc.category} • v{doc.version} • {doc.fileSize} • Uploaded {formatDate(doc.uploadDate)} by {doc.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading official document: ${doc.title || doc.name}`)}
                    className="p-2 rounded-xl text-teal-700 hover:bg-teal-50 dark:text-teal-400 transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 12: Audit Trail */}
      {activeTab === 'audit_trail' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
            Audit Trail for {study.id}
          </h3>

          <div className="space-y-3 text-xs">
            {studyAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {log.action} by {log.userName} ({(log.role || log.userRole || 'USER').toUpperCase()})
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Tabs fallback if clicked */}
      {(activeTab === 'visits' || activeTab === 'data_quality') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          Showing filtered data for {study.id}. Please consult the dedicated Visits and Data Quality modules from the main sidebar for deep interactive query resolution and visit calendars.
        </div>
      )}

      {/* Add Deviation Modal */}
      {showAddDeviationModal && (
        <Modal
          isOpen={showAddDeviationModal}
          onClose={() => setShowAddDeviationModal(false)}
          title={`Log Protocol Deviation: ${study.id}`}
          subtitle="Record non-compliance event and corrective action plan (CAPA)"
        >
          <form onSubmit={handleSaveDeviation} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Participant ID
              </label>
              <select
                value={newDev.participantId}
                onChange={(e) => setNewDev({ ...newDev, participantId: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              >
                <option value="">Select subject or General</option>
                {studyParticipants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} ({p.siteName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Severity Level
              </label>
              <select
                value={newDev.severity}
                onChange={(e) => setNewDev({ ...newDev, severity: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              >
                <option value="Minor">Minor (e.g. Visit delayed by 2 days)</option>
                <option value="Major">Major (e.g. Missed required lab test)</option>
                <option value="Critical">Critical (e.g. Dosing error, eligibility breach)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Description
              </label>
              <textarea
                rows={2}
                required
                value={newDev.description}
                onChange={(e) => setNewDev({ ...newDev, description: e.target.value })}
                placeholder="Details of the protocol variation..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corrective and Preventive Action (CAPA)
              </label>
              <textarea
                rows={2}
                required
                value={newDev.actionTaken}
                onChange={(e) => setNewDev({ ...newDev, actionTaken: e.target.value })}
                placeholder="Corrective steps taken by investigator..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddDeviationModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
              >
                Record Deviation
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Document Modal */}
      {showAddDocModal && (
        <Modal
          isOpen={showAddDocModal}
          onClose={() => setShowAddDocModal(false)}
          title={`Upload Trial Document: ${study.id}`}
        >
          <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Title
              </label>
              <input
                type="text"
                required
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="e.g. Informed Consent Form (Hindi) v1.2"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 dark:bg-slate-800"
                >
                  <option value="Protocol Amendment">Protocol Amendment</option>
                  <option value="Informed Consent Form">Informed Consent Form</option>
                  <option value="Investigator Brochure">Investigator Brochure</option>
                  <option value="Ethics Approval Letter">Ethics Approval Letter</option>
                  <option value="Monitoring Report">Monitoring Report</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  required
                  value={newDoc.version}
                  onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center text-slate-400">
              <Download className="w-6 h-6 mx-auto mb-2 text-slate-400 rotate-180" />
              <span>Simulated PDF document ready for attachment</span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
              >
                Upload & Register
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
