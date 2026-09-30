import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Search,
  PlusCircle,
  FileCheck2,
  Clock,
  CheckCircle2,
  Eye,
  AlertOctagon,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SafetyReport } from '../../types';
import { formatDate } from '../../lib/utils';

export function SafetyPage() {
  const { safetyReports, studies, participants, addSafetyReport, updateSafetyReport } = useData();
  const { role } = useAuth();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [seriousOnly, setSeriousOnly] = useState(() => searchParams.get('filter') === 'pending');

  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Safety Event State
  const [newEvent, setNewEvent] = useState({
    studyId: studies[0]?.id || 'AYU-2026-001',
    participantId: participants[0]?.id || 'SUBJ-DEL-101',
    eventType: 'Adverse Event (AE)' as const,
    severity: 'Moderate' as const,
    isSerious: false,
    eventDescription: '',
    onsetDateTime: new Date().toISOString().slice(0, 16),
    actionTaken: 'Intervention temporarily withheld, supportive care initiated',
    outcome: 'Recovering' as const,
    causalityAyurveda: 'Possible (Temporal relationship)',
    reportedDate: new Date().toISOString().split('T')[0],
    reportedBy: 'Study Coordinator',
    regulatoryReportingDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  });

  const filteredReports = safetyReports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.eventDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || r.eventType.includes(typeFilter);
    const matchesSeverity = severityFilter === 'ALL' || r.severity === severityFilter;
    const matchesSerious = seriousOnly ? r.isSerious && r.status !== 'Resolved' : true;

    return matchesSearch && matchesType && matchesSeverity && matchesSerious;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `SAE-${new Date().getFullYear()}-0${safetyReports.length + 1}`;
    const reportToAdd: SafetyReport = {
      id,
      ...newEvent,
      status: 'Under Review',
    };
    addSafetyReport(reportToAdd);
    setShowAddModal(false);
  };

  const handleResolveReport = (report: SafetyReport) => {
    updateSafetyReport({
      ...report,
      status: 'Resolved',
      outcome: 'Recovered completely',
    });
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>Pharmacovigilance & Safety Surveillance Desk</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking AE, SAE, ADR notifications, Ayurvedic causality assessment, and mandatory CDSCO/IEC regulatory reporting
          </p>
        </div>

        {role !== 'regulator' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Safety Event (AE/SAE)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Event ID, symptom description, study, or subject ID..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 text-xs font-bold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={seriousOnly}
              onChange={(e) => setSeriousOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span>Show Active Serious Adverse Events (SAE) Only</span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Event Classification
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="ALL">All Event Types</option>
              <option value="AE">Adverse Event (AE)</option>
              <option value="SAE">Serious Adverse Event (SAE)</option>
              <option value="ADR">Adverse Drug Reaction (ADR)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Severity Grading
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="ALL">All Severities</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Life-Threatening">Life-Threatening</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Reporting Window
            </label>
            <span className="text-slate-500 text-[11px] block mt-1">
              24-Hour Expedited (Death/Inpatient) & 14-Day Full Dossier
            </span>
          </div>
        </div>
      </div>

      {/* Safety Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Event ID</th>
                <th className="py-3.5 px-3">Protocol / Subject</th>
                <th className="py-3.5 px-3">Classification</th>
                <th className="py-3.5 px-3">Severity</th>
                <th className="py-3.5 px-4 min-w-[220px]">Event Description</th>
                <th className="py-3.5 px-3">Causality</th>
                <th className="py-3.5 px-3">Deadline</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No safety records found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
                      {r.id}
                      {r.isSerious && (
                        <span className="block text-[9px] uppercase font-bold text-rose-700 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.2 rounded w-fit mt-0.5">
                          Expedited SAE
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {r.studyId}
                      </span>
                      <span className="font-mono text-slate-500 text-[10px]">
                        {r.participantId}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant={r.eventType}>{r.eventType}</Badge>
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant={r.severity}>{r.severity}</Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                        {r.eventDescription}
                      </p>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {r.causalityAyurveda || r.causalityAyurvedaDrug || 'Pending'}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px]">
                      {(r.regulatoryReportingDeadline || r.regulatoryDeadline) ? (
                        <span className="text-amber-600 font-semibold">
                          {formatDate(r.regulatoryReportingDeadline || r.regulatoryDeadline)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant={r.status}>{r.status}</Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReport(r)}
                        className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40 transition-colors"
                        title="View Full Safety Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Report Inspection Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Safety Dossier: ${selectedReport.id}`}
          subtitle={`${selectedReport.studyId} • Subject: ${selectedReport.participantId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Classification</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedReport.eventType} ({selectedReport.severity})
                </span>
              </div>
              <Badge variant={selectedReport.status}>{selectedReport.status}</Badge>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Description of Adverse Event</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedReport.eventDescription}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-slate-500">
                <span>Onset Date: {formatDate(selectedReport.onsetDateTime || selectedReport.onsetDate)}</span>
                <span>Reported Date: {formatDate(selectedReport.reportedDate)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Causality Assessment</span>
                <span>{selectedReport.causalityAyurveda || selectedReport.causalityAyurvedaDrug || 'Under Review'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Action & Treatment</span>
                <span>{selectedReport.actionTaken}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              {selectedReport.status !== 'Resolved' && role !== 'regulator' && (
                <button
                  type="button"
                  onClick={() => handleResolveReport(selectedReport)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Mark Event Resolved
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold ml-auto"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Log Safety Event Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Log Adverse Event / SAE Notification"
          subtitle="Prompt reporting under Pharmacovigilance Programme of India (PvPI - Ayush)"
        >
          <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Associated Study *
                </label>
                <select
                  value={newEvent.studyId}
                  onChange={(e) => setNewEvent({ ...newEvent, studyId: e.target.value })}
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
                  value={newEvent.participantId}
                  onChange={(e) => setNewEvent({ ...newEvent, participantId: e.target.value })}
                  placeholder="e.g. SUBJ-DEL-101"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 font-mono dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Classification
                </label>
                <select
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  <option value="Adverse Event (AE)">Adverse Event (AE)</option>
                  <option value="Serious Adverse Event (SAE)">Serious Adverse Event (SAE)</option>
                  <option value="Adverse Drug Reaction (ADR)">Adverse Drug Reaction (ADR)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Severity Level
                </label>
                <select
                  value={newEvent.severity}
                  onChange={(e) => setNewEvent({ ...newEvent, severity: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Life-Threatening">Life-Threatening</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Clinical Description *
              </label>
              <textarea
                rows={3}
                required
                value={newEvent.eventDescription}
                onChange={(e) => setNewEvent({ ...newEvent, eventDescription: e.target.value })}
                placeholder="Onset symptoms, duration, clinical interventions administered..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ayurvedic Causality (Ayush PV)
                </label>
                <select
                  value={newEvent.causalityAyurveda}
                  onChange={(e) => setNewEvent({ ...newEvent, causalityAyurveda: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  <option value="Probable / Likely">Probable / Likely</option>
                  <option value="Possible (Temporal relationship)">Possible (Temporal relationship)</option>
                  <option value="Unlikely related">Unlikely related</option>
                  <option value="Unclassifiable / Pending tests">Unclassifiable / Pending tests</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Immediate Action Taken
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.actionTaken}
                  onChange={(e) => setNewEvent({ ...newEvent, actionTaken: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newEvent.isSerious}
                  onChange={(e) => setNewEvent({ ...newEvent, isSerious: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="font-bold text-rose-700 dark:text-rose-400">
                  Mark as Serious Adverse Event (Requires mandatory 24-Hour Expedited Ethics / CDSCO Alert)
                </span>
              </label>
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
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold"
              >
                Submit Safety Report
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
