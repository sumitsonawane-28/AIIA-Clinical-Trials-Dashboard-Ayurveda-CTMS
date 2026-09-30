import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileCheck2,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
  Download,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';

export function RegulatoryPage() {
  const { studies, regulatoryItems, updateStudy } = useData();
  const { role } = useAuth();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'ethics' | 'ctri'>(() => {
    return searchParams.get('tab') === 'ctri' ? 'ctri' : 'ethics';
  });

  const [renewStudy, setRenewStudy] = useState<any | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('2027-12-31');

  const [ctriUpdateStudy, setCtriUpdateStudy] = useState<any | null>(null);
  const [newCtriDeadline, setNewCtriDeadline] = useState('2027-06-30');

  const handleSaveRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    if (renewStudy) {
      updateStudy({
        ...renewStudy,
        iecExpiryDate: newExpiryDate,
        ethicsStatus: 'Approved',
      });
      setRenewStudy(null);
    }
  };

  const handleSaveCtriUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (ctriUpdateStudy) {
      updateStudy({
        ...ctriUpdateStudy,
        ctriLastUpdate: new Date().toISOString().split('T')[0],
        ctriNextUpdateDeadline: newCtriDeadline,
        ctriStatus: 'Registered & Current',
      });
      setCtriUpdateStudy(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-teal-700" />
            <span>Ethics (IEC) & CTRI Regulatory Surveillance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking Institutional Ethics clearances, renewal deadlines, and ICMR-CTRI mandatory half-yearly reporting
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('ethics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ethics'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Ethics (IEC) Clearances
          </button>
          <button
            onClick={() => setActiveTab('ctri')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ctri'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            CTRI Mandatory Updates
          </button>
        </div>
      </div>

      {/* TAB 1: Ethics (IEC) Clearances */}
      {activeTab === 'ethics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active Protocols</span>
              <span className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 mt-1 block">
                {studies.length}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Approved institutional studies</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual IEC Approvals Valid</span>
              <span className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400 mt-1 block">
                {studies.filter((s) => s.ethicsStatus === 'Approved').length}
              </span>
              <span className="text-[11px] text-emerald-600 mt-0.5 block">In full compliance</span>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-3xl border border-amber-200 dark:border-amber-900 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">
                Expiring in &lt;60 Days
              </span>
              <span className="text-2xl font-bold font-serif text-amber-900 dark:text-amber-200 mt-1 block">
                {studies.filter((s) => s.ethicsStatus !== 'Approved' || s.health === 'At Risk').length}
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 block">
                Annual renewal due
              </span>
            </div>
          </div>

          {/* Ethics Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500">
                    <th className="py-3.5 px-4">Protocol ID</th>
                    <th className="py-3.5 px-3 min-w-[200px]">Study Acronym</th>
                    <th className="py-3.5 px-3">IEC Approval Ref</th>
                    <th className="py-3.5 px-3">Approval Date</th>
                    <th className="py-3.5 px-3">Expiry / Review Date</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studies.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-800 dark:text-teal-300">
                        {s.id}
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {s.shortTitle}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {s.iecApprovalNumber}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {formatDate(s.iecApprovalDate)}
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-amber-600">
                        {formatDate(s.iecExpiryDate)}
                      </td>

                      <td className="py-3.5 px-3">
                        <Badge variant={s.ethicsStatus}>{s.ethicsStatus}</Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {role !== 'regulator' && (
                          <button
                            onClick={() => setRenewStudy(s)}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 font-bold border border-teal-200 dark:border-teal-800"
                          >
                            Submit Renewal
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

      {/* TAB 2: CTRI Registrations & Half-yearly Updates */}
      {activeTab === 'ctri' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">ICMR - CTRI Compliance Mandate:</span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                As per Indian Council of Medical Research (ICMR) & CDSCO directives, all ongoing interventional clinical trials in Ayurveda must log 6-monthly progress reports and participant accrual updates to the Clinical Trials Registry - India (CTRI).
              </p>
            </div>
          </div>

          {/* CTRI Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500">
                    <th className="py-3.5 px-4">Protocol ID</th>
                    <th className="py-3.5 px-3">CTRI Registration #</th>
                    <th className="py-3.5 px-3">Registered On</th>
                    <th className="py-3.5 px-3">Last Log Update</th>
                    <th className="py-3.5 px-3">Next 6-Month Deadline</th>
                    <th className="py-3.5 px-3">Compliance Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studies.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-800 dark:text-teal-300">
                        {s.id}
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {s.ctriNumber || 'Registration Pending'}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {formatDate(s.ctriRegistrationDate)}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {formatDate(s.ctriLastUpdate)}
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-amber-600">
                        {formatDate(s.ctriNextUpdateDeadline)}
                      </td>

                      <td className="py-3.5 px-3">
                        <Badge variant={s.ctriStatus}>{s.ctriStatus}</Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {role !== 'regulator' && (
                          <button
                            onClick={() => setCtriUpdateStudy(s)}
                            className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] shadow-xs"
                          >
                            Log 6-Mo Update
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

      {/* IEC Renewal Modal */}
      {renewStudy && (
        <Modal
          isOpen={!!renewStudy}
          onClose={() => setRenewStudy(null)}
          title={`Submit Ethics Annual Extension: ${renewStudy.id}`}
          subtitle={renewStudy.shortTitle}
        >
          <form onSubmit={handleSaveRenewal} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Approval / Renewal Valid Until *
              </label>
              <input
                type="date"
                required
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                IEC Annual Progress Report Reference / Meeting Date
              </label>
              <input
                type="text"
                placeholder="e.g. IEC-AIIA 42nd Meeting Minutes dated 12/03/2026"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRenewStudy(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
              >
                Record Extension
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CTRI 6-Month Log Modal */}
      {ctriUpdateStudy && (
        <Modal
          isOpen={!!ctriUpdateStudy}
          onClose={() => setCtriUpdateStudy(null)}
          title={`Log CTRI Mandatory Progress Update: ${ctriUpdateStudy.id}`}
          subtitle={`Registration Number: ${ctriUpdateStudy.ctriNumber}`}
        >
          <form onSubmit={handleSaveCtriUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Next Half-Yearly Update Deadline *
              </label>
              <input
                type="date"
                required
                value={newCtriDeadline}
                onChange={(e) => setNewCtriDeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Trial Progress Log Details
              </label>
              <textarea
                rows={3}
                placeholder="Total 148 subjects enrolled, 0 SAE reported during last 6 months, no protocol amendments..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCtriUpdateStudy(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
              >
                Verify & Save CTRI Log
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
