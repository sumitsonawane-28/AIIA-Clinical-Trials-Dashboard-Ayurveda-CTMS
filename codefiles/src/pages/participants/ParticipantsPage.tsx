import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Eye,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileCheck,
  Building2,
  HeartPulse,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Participant } from '../../types';
import { formatDate } from '../../lib/utils';

export function ParticipantsPage() {
  const { participants, studies, sites, addParticipant, updateParticipant } = useData();
  const { role } = useAuth();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [studyFilter, setStudyFilter] = useState('ALL');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [prakritiFilter, setPrakritiFilter] = useState('ALL');

  // Modals
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Participant Form State
  const [newSubj, setNewSubj] = useState({
    id: `SUBJ-DEL-${Math.floor(Math.random() * 900) + 100}`,
    studyId: studies[0]?.id || 'AYU-2026-001',
    siteId: sites[0]?.id || 'SITE-DEL-01',
    age: 42,
    gender: 'Female' as const,
    ayurvedicPrakriti: 'Pitta-Kapha',
    enrollmentDate: new Date().toISOString().split('T')[0],
    consentSignedDate: new Date().toISOString().split('T')[0],
    currentVisitStatus: 'Screening Visit (V0)',
    status: 'Screening' as const,
    assignedArm: 'Experimental (Active Formulation)',
    complianceRate: 100,
    vitals: {
      bloodPressure: '120/80 mmHg',
      heartRate: 74,
      bmi: 23.4,
    },
    screeningEligibilityConfirmed: true,
  });

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.studyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.siteName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStudy = studyFilter === 'ALL' || p.studyId === studyFilter;
      const matchesSite = siteFilter === 'ALL' || p.siteId === siteFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesPrakriti =
        prakritiFilter === 'ALL' || (p.ayurvedicPrakriti && p.ayurvedicPrakriti.includes(prakritiFilter));

      return matchesSearch && matchesStudy && matchesSite && matchesStatus && matchesPrakriti;
    });
  }, [participants, searchTerm, studyFilter, siteFilter, statusFilter, prakritiFilter]);

  const handleCreateParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    const siteObj = sites.find((s) => s.id === newSubj.siteId);
    const participantToAdd: Participant = {
      ...newSubj,
      siteName: siteObj?.name || 'AIIA New Delhi',
      visits: [
        {
          id: `v-${Date.now()}-0`,
          visitNumber: 'V0',
          visitName: 'Screening & Consent',
          scheduledDate: newSubj.enrollmentDate,
          actualDate: newSubj.enrollmentDate,
          status: 'Completed',
          windowDays: 0,
        },
        {
          id: `v-${Date.now()}-1`,
          visitNumber: 'V1',
          visitName: 'Baseline & Randomization',
          scheduledDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          status: 'Scheduled',
          windowDays: 2,
        },
        {
          id: `v-${Date.now()}-2`,
          visitNumber: 'V2',
          visitName: 'Week 4 Assessment',
          scheduledDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
          status: 'Upcoming',
          windowDays: 3,
        },
      ],
    };
    addParticipant(participantToAdd);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
            Clinical Trial Participants
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Subject recruitment, Ayurvedic Prakriti constitutional mapping, visit compliance, and retention
          </p>
        </div>

        {role !== 'regulator' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enlist Participant</span>
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
              placeholder="Search by Subject ID, Trial ID, or Site..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {(searchTerm || studyFilter !== 'ALL' || siteFilter !== 'ALL' || statusFilter !== 'ALL' || prakritiFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStudyFilter('ALL');
                setSiteFilter('ALL');
                setStatusFilter('ALL');
                setPrakritiFilter('ALL');
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Trial Study
            </label>
            <select
              value={studyFilter}
              onChange={(e) => setStudyFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs truncate"
            >
              <option value="ALL">All Studies</option>
              {studies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.shortTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Research Site
            </label>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs truncate"
            >
              <option value="ALL">All Research Sites</option>
              {sites.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Participant Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Screening">Screening</option>
              <option value="Completed">Completed</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Lost to Follow-up">Lost to Follow-up</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Ayurvedic Prakriti
            </label>
            <select
              value={prakritiFilter}
              onChange={(e) => setPrakritiFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="ALL">All Prakritis</option>
              <option value="Vata">Vata Dominant</option>
              <option value="Pitta">Pitta Dominant</option>
              <option value="Kapha">Kapha Dominant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Subject ID</th>
                <th className="py-3.5 px-3">Study Protocol</th>
                <th className="py-3.5 px-3">Age / Sex</th>
                <th className="py-3.5 px-3">Prakriti (Dosha)</th>
                <th className="py-3.5 px-3">Allocated Site</th>
                <th className="py-3.5 px-3">Visit Progress</th>
                <th className="py-3.5 px-3">Compliance</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No clinical trial participants match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 dark:text-teal-300">
                      {p.id}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {p.studyId}
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                      {p.age} y / {p.gender}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                        {p.ayurvedicPrakriti || 'Unassessed'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
                      {p.siteName}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {p.currentVisitStatus}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-teal-700 dark:text-teal-400">
                      {p.complianceRate}%
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant={p.status}>{p.status}</Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedParticipant(p)}
                        className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40 transition-colors"
                        title="View Participant Profile"
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

      {/* Participant Profile Modal */}
      {selectedParticipant && (
        <Modal
          isOpen={!!selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          title={`Subject Profile: ${selectedParticipant.id}`}
          subtitle={`${selectedParticipant.studyId} • ${selectedParticipant.siteName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Age / Sex</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedParticipant.age}y / {selectedParticipant.gender}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Prakriti</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  {selectedParticipant.ayurvedicPrakriti}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Trial Arm</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  {selectedParticipant.assignedArm || 'Experimental'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <Badge variant={selectedParticipant.status}>{selectedParticipant.status}</Badge>
              </div>
            </div>

            {/* Baseline Vitals */}
            {selectedParticipant.vitals && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>Baseline Clinical Vitals</span>
                </span>
                <div className="grid grid-cols-3 gap-2 text-slate-600 dark:text-slate-300">
                  <div>BP: <strong className="text-slate-900 dark:text-slate-100">{selectedParticipant.vitals?.bloodPressure || '120/80'}</strong></div>
                  <div>Heart Rate: <strong className="text-slate-900 dark:text-slate-100">{selectedParticipant.vitals?.heartRate || 72} bpm</strong></div>
                  <div>BMI: <strong className="text-slate-900 dark:text-slate-100">{selectedParticipant.vitals?.bmi || 22.5} kg/m²</strong></div>
                </div>
              </div>
            )}

            {/* Visit Timeline */}
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-2">
                Protocol Visit Schedule & Adherence
              </span>
              <div className="space-y-2">
                {selectedParticipant.visits && selectedParticipant.visits.length > 0 ? (
                  selectedParticipant.visits.map((v: any) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold font-mono text-teal-700 dark:text-teal-400 mr-2">
                          {v.visitNumber}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">
                          {v.visitName}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          Target: {formatDate(v.scheduledDate)}
                          {v.actualDate && ` • Conducted: ${formatDate(v.actualDate)}`}
                        </div>
                      </div>
                      <Badge variant={v.status}>{v.status}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400">
                    No scheduled visits recorded yet.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold"
              >
                Close Record
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Participant Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Enlist Clinical Subject"
          subtitle="Participant registration with GCP Consent and Ayurvedic Prakriti diagnosis"
        >
          <form onSubmit={handleCreateParticipant} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={newSubj.id}
                  onChange={(e) => setNewSubj({ ...newSubj, id: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 font-mono dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Trial *
                </label>
                <select
                  value={newSubj.studyId}
                  onChange={(e) => setNewSubj({ ...newSubj, studyId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  {studies.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} - {s.shortTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  value={newSubj.age}
                  onChange={(e) => setNewSubj({ ...newSubj, age: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={newSubj.gender}
                  onChange={(e) => setNewSubj({ ...newSubj, gender: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ayurvedic Prakriti
                </label>
                <select
                  value={newSubj.ayurvedicPrakriti}
                  onChange={(e) => setNewSubj({ ...newSubj, ayurvedicPrakriti: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  <option value="Vata-Pitta">Vata-Pitta</option>
                  <option value="Pitta-Kapha">Pitta-Kapha</option>
                  <option value="Kapha-Vata">Kapha-Vata</option>
                  <option value="Vata">Vata Dominant</option>
                  <option value="Pitta">Pitta Dominant</option>
                  <option value="Kapha">Kapha Dominant</option>
                  <option value="Tridoshaja">Tridoshaja (Balanced)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Site Facility
                </label>
                <select
                  value={newSubj.siteId}
                  onChange={(e) => setNewSubj({ ...newSubj, siteId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                >
                  {sites.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Informed Consent Date
                </label>
                <input
                  type="date"
                  value={newSubj.consentSignedDate}
                  onChange={(e) => setNewSubj({ ...newSubj, consentSignedDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={newSubj.screeningEligibilityConfirmed}
                  onChange={(e) =>
                    setNewSubj({ ...newSubj, screeningEligibilityConfirmed: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  I certify all protocol inclusion and exclusion criteria were verified and informed consent was signed prior to screening procedures.
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
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
              >
                Register Participant
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
