import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Building2,
  Users,
  Eye,
  Plus,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';

export function VisitsPage() {
  const { visits, studies, sites, participants, updateVisit, addVisit } = useData();
  const { role } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [studyFilter, setStudyFilter] = useState('ALL');

  // Modal State
  const [completeVisitModal, setCompleteVisitModal] = useState<any | null>(null);
  const [actualDateInput, setActualDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [visitNotes, setVisitNotes] = useState('');

  // Filter logic
  const filteredVisits = visits.filter((v: any) => {
    const pId = v.participantId || '';
    const vName = v.visitName || v.visitType || v.siteName || '';
    const vNum = v.visitNumber || '';

    const matchesSearch =
      pId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vNum.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleMarkCompleted = (e: React.FormEvent) => {
    e.preventDefault();
    if (completeVisitModal) {
      updateVisit({
        ...completeVisitModal,
        status: 'Completed',
        actualDate: actualDateInput,
        craVerified: true,
      });
      setCompleteVisitModal(null);
      setVisitNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
            Clinical Visits & Protocol Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking participant visit windows, CRF completion, and CRA source data verification (SDV)
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Participant ID, Visit Code (e.g. V1, V2), or Name..."
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs w-full sm:w-auto"
          >
            <option value="ALL">All Visit Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Overdue">Overdue / Delayed</option>
            <option value="Missed">Missed</option>
          </select>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-3">Visit Code</th>
                <th className="py-3.5 px-3">Visit Name</th>
                <th className="py-3.5 px-3">Target Date</th>
                <th className="py-3.5 px-3">Actual Date</th>
                <th className="py-3.5 px-3">Window</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">CRA SDV Verified</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No clinical visits matching filter parameters.
                  </td>
                </tr>
              ) : (
                filteredVisits.map((v: any) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 dark:text-teal-300">
                      {v.participantId || v.siteId || 'PT-SUBJ'}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {v.visitNumber || 'V1'}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {v.visitName || v.visitType || 'Scheduled Visit'}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-mono">
                      {formatDate(v.scheduledDate)}
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      {v.actualDate ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          {formatDate(v.actualDate)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500">
                      ±{v.windowDays ?? 3} days
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant={v.status}>{v.status}</Badge>
                    </td>

                    <td className="py-3.5 px-3">
                      {v.craVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending SDV</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {v.status !== 'Completed' && role !== 'regulator' && (
                        <button
                          onClick={() => setCompleteVisitModal(v)}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] shadow-xs"
                        >
                          Complete Visit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Visit Modal */}
      {completeVisitModal && (
        <Modal
          isOpen={!!completeVisitModal}
          onClose={() => setCompleteVisitModal(null)}
          title={`Confirm Visit Completion: ${completeVisitModal.visitNumber}`}
          subtitle={`${completeVisitModal.participantId} • ${completeVisitModal.visitName}`}
        >
          <form onSubmit={handleMarkCompleted} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Actual Clinical Visit Date *
              </label>
              <input
                type="date"
                required
                value={actualDateInput}
                onChange={(e) => setActualDateInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Observations / Dosing Adherence Note
              </label>
              <textarea
                rows={3}
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                placeholder="Patient tolerated Ayurvedic formulation well. Pill count adherence verified 100%..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCompleteVisitModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
              >
                Sign & Save Visit
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
