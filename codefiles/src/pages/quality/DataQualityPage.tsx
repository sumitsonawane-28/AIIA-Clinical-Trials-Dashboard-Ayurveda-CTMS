import React, { useState } from 'react';
import {
  CheckSquare,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  Clock,
  Building2,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../lib/utils';
import { ProtocolDeviation } from '../../types';

export function DataQualityPage() {
  const { protocolDeviations, studies, sites, participants, addProtocolDeviation } = useData();
  const { role } = useAuth();

  const [activeTab, setActiveTab] = useState<'deviations' | 'queries'>('deviations');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDev, setNewDev] = useState({
    studyId: studies[0]?.id || 'AYU-2026-001',
    participantId: participants[0]?.id || 'SUBJ-DEL-101',
    siteId: sites[0]?.id || 'SITE-DEL-01',
    deviationCategory: 'Visit Window' as const,
    severity: 'Minor' as const,
    description: '',
    dateIdentified: new Date().toISOString().split('T')[0],
    correctiveAction: 'Study Coordinator counseled participant on strict window compliance.',
    preventiveAction: 'Automated SMS appointment reminders scheduled 48h prior.',
  });

  // Mock Queries for eCRF
  const [queries, setQueries] = useState([
    {
      id: 'QRY-2026-01',
      studyId: 'AYU-2026-001',
      participantId: 'SUBJ-DEL-101',
      field: 'V2_Serum_Creatinine',
      issue: 'Out of physiological range without PI clinical significance comment',
      openedDate: '2026-03-10',
      status: 'Open',
      agingDays: 11,
    },
    {
      id: 'QRY-2026-02',
      studyId: 'AYU-2026-002',
      participantId: 'SUBJ-JAI-201',
      field: 'V1_Ayurvedic_Prakriti_Score',
      issue: 'Incomplete sub-scores for Pitta temperament assessment',
      openedDate: '2026-03-16',
      status: 'Open',
      agingDays: 5,
    },
    {
      id: 'QRY-2026-03',
      studyId: 'AYU-2026-003',
      participantId: 'SUBJ-MUM-301',
      field: 'V0_Informed_Consent_Timestamp',
      issue: 'Timestamp illegible on uploaded scanned CRF page',
      openedDate: '2026-02-28',
      status: 'Resolved',
      agingDays: 0,
    },
  ]);

  const filteredDeviations = (protocolDeviations || []).filter((d: any) => {
    const pId = d.participantId || '';
    const cat = d.deviationCategory || d.type || '';
    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.studyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || cat === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || d.severity === severityFilter;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleCreateDeviation = (e: React.FormEvent) => {
    e.preventDefault();
    const siteObj = sites.find((s) => s.id === newDev.siteId);
    const deviationToAdd: ProtocolDeviation = {
      id: `DEV-2026-0${protocolDeviations.length + 1}`,
      ...newDev,
      siteName: siteObj?.name || 'AIIA New Delhi',
      status: 'Reported',
      reportedToIEC: false,
    };
    addProtocolDeviation(deviationToAdd);
    setShowAddModal(false);
  };

  const handleResolveQuery = (queryId: string) => {
    setQueries(queries.map((q) => (q.id === queryId ? { ...q, status: 'Resolved' } : q)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-teal-700" />
            <span>Data Quality & Protocol Deviations (CAPA)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            eCRF query aging, Source Data Verification (SDV) flags, and Good Clinical Practice (GCP) deviation tracking
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('deviations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'deviations'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Protocol Deviations ({protocolDeviations.length})
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'queries'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Data Queries ({queries.filter((q) => q.status === 'Open').length} Open)
          </button>
        </div>
      </div>

      {/* TAB 1: Protocol Deviations */}
      {activeTab === 'deviations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search deviations by code, subject ID, or cause..."
                className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs"
              >
                <option value="ALL">All Root Causes</option>
                <option value="Visit Window">Visit Window</option>
                <option value="Investigational Product">Investigational Product</option>
                <option value="Informed Consent">Informed Consent</option>
                <option value="Eligibility Criteria">Eligibility Criteria</option>
                <option value="Laboratory">Laboratory / Diagnostic</option>
              </select>

              {role !== 'regulator' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs whitespace-nowrap"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Log Deviation</span>
                </button>
              )}
            </div>
          </div>

          {/* Deviations Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500">
                    <th className="py-3.5 px-4">Deviation ID</th>
                    <th className="py-3.5 px-3">Study / Subject</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Severity</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Description & Root Cause</th>
                    <th className="py-3.5 px-3">Identified Date</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">IEC Notified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDeviations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No protocol deviations recorded under selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredDeviations.map((d: any) => (
                      <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                          {d.id}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {d.studyId}
                          </span>
                          <span className="font-mono text-slate-500 text-[10px]">
                            {d.participantId}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {d.deviationCategory}
                        </td>

                        <td className="py-3.5 px-3">
                          <Badge variant={d.severity}>{d.severity}</Badge>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {d.description}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-slate-500">
                          {formatDate(d.dateIdentified)}
                        </td>

                        <td className="py-3.5 px-3">
                          <Badge variant={d.status}>{d.status}</Badge>
                        </td>

                        <td className="py-3.5 px-3">
                          {d.reportedToIEC ? (
                            <span className="text-emerald-700 font-bold">Yes</span>
                          ) : (
                            <span className="text-slate-400">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: eCRF Queries */}
      {activeTab === 'queries' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500">
                    <th className="py-3.5 px-4">Query ID</th>
                    <th className="py-3.5 px-3">Trial / Subject</th>
                    <th className="py-3.5 px-3">Data Field / CRF Section</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Validation Issue</th>
                    <th className="py-3.5 px-3">Aging (Days)</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {queries.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-800 dark:text-teal-300">
                        {q.id}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          {q.studyId}
                        </span>
                        <span className="font-mono text-slate-500 text-[10px]">
                          {q.participantId}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {q.field}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {q.issue}
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold">
                        {q.agingDays > 7 ? (
                          <span className="text-rose-600">{q.agingDays} days (Overdue)</span>
                        ) : (
                          <span className="text-slate-600">{q.agingDays} days</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <Badge variant={q.status}>{q.status}</Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {q.status === 'Open' && role !== 'regulator' && (
                          <button
                            onClick={() => handleResolveQuery(q.id)}
                            className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px]"
                          >
                            Resolve Query
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Deviation Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Log Protocol Deviation (CAPA)"
          subtitle="Document non-compliance to trial protocol or Good Clinical Practice"
        >
          <form onSubmit={handleCreateDeviation} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Study *
                </label>
                <select
                  value={newDev.studyId}
                  onChange={(e) => setNewDev({ ...newDev, studyId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  {studies.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id}: {s.shortTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={newDev.participantId}
                  onChange={(e) => setNewDev({ ...newDev, participantId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 font-mono dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deviation Root Cause Category
                </label>
                <select
                  value={newDev.deviationCategory}
                  onChange={(e) => setNewDev({ ...newDev, deviationCategory: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  <option value="Visit Window">Visit Window Exceeded</option>
                  <option value="Investigational Product">Investigational Product Dispensing / Dosing</option>
                  <option value="Informed Consent">Informed Consent Process</option>
                  <option value="Eligibility Criteria">Eligibility / Inclusion Criteria</option>
                  <option value="Laboratory">Laboratory / Diagnostic Assessment</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Severity Grading
                </label>
                <select
                  value={newDev.severity}
                  onChange={(e) => setNewDev({ ...newDev, severity: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  <option value="Minor">Minor (No impact on safety/data integrity)</option>
                  <option value="Major">Major (Potential impact on study outcome)</option>
                  <option value="Critical">Critical (Immediate IEC notification required)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Deviation Description *
              </label>
              <textarea
                rows={2}
                required
                value={newDev.description}
                onChange={(e) => setNewDev({ ...newDev, description: e.target.value })}
                placeholder="Participant attended Week 4 visit 6 days past the allowable window due to outstation travel..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corrective Action (Immediate)
              </label>
              <input
                type="text"
                required
                value={newDev.correctiveAction}
                onChange={(e) => setNewDev({ ...newDev, correctiveAction: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Submit CAPA Deviation
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
