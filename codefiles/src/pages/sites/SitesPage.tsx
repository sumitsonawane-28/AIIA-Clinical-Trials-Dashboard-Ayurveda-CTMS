import React, { useState } from 'react';
import {
  Building2,
  Search,
  PlusCircle,
  MapPin,
  UserCheck,
  Activity,
  Award,
  Calendar,
  AlertTriangle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Site } from '../../types';
import { formatDate } from '../../lib/utils';

export function SitesPage() {
  const { sites, studies, addSite } = useData();
  const { role } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Site state
  const [newSite, setNewSite] = useState({
    name: '',
    code: '',
    city: '',
    state: '',
    address: '',
    principalInvestigator: '',
    coordinatorName: '',
    status: 'Active' as const,
    targetEnrollmentTotal: 150,
  });

  const filteredSites = sites.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || st.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    const siteToAdd: Site = {
      id: `SITE-${newSite.city.toUpperCase().slice(0, 3)}-0${sites.length + 1}`,
      name: newSite.name,
      code: newSite.code || newSite.name.slice(0, 4).toUpperCase(),
      city: newSite.city,
      state: newSite.state,
      address: newSite.address,
      principalInvestigator: newSite.principalInvestigator,
      coordinatorName: newSite.coordinatorName,
      status: newSite.status,
      activeStudiesCount: 1,
      currentEnrollmentTotal: 0,
      targetEnrollmentTotal: newSite.targetEnrollmentTotal,
      dataQualityScore: 98,
      lastMonitoringVisit: new Date().toISOString().split('T')[0],
      pendingQueriesCount: 0,
      sivCompletedDate: new Date().toISOString().split('T')[0],
    };
    addSite(siteToAdd);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
            Collaborative Research Sites
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ayurveda institutions, medical colleges, and central hospitals conducting multi-center trials
          </p>
        </div>

        {role !== 'regulator' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Onboard Research Site</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by center name, city, or Lead Investigator..."
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs w-full sm:w-auto"
          >
            <option value="ALL">All Operational Statuses</option>
            <option value="Active">Active Centers</option>
            <option value="SIV Pending">Site Initiation (SIV) Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSites.map((st) => {
          const completionRate = Math.round(
            (st.currentEnrollmentTotal / (st.targetEnrollmentTotal || 1)) * 100
          );

          return (
            <div
              key={st.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800">
                      {st.code}
                    </span>
                    <Badge variant={st.status}>{st.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Award className="w-3 h-3" />
                    <span>{st.dataQualityScore}% Quality</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-serif line-clamp-2">
                  {st.name}
                </h3>

                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{st.city}, {st.state}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Site PI:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                      {st.principalInvestigator}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Study Coordinator:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                      {st.coordinatorName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Monitored:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {formatDate(st.lastMonitoringVisit || st.lastMonitoringDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accrual Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Accrual Progress</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {st.currentEnrollmentTotal} / {st.targetEnrollmentTotal} ({completionRate}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
                  <div
                    className="h-full bg-teal-700 rounded-full"
                    style={{ width: `${Math.min(completionRate, 100)}%` }}
                  />
                </div>

                <button
                  onClick={() => setSelectedSite(st)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Site Profile</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Site Inspection Modal */}
      {selectedSite && (
        <Modal
          isOpen={!!selectedSite}
          onClose={() => setSelectedSite(null)}
          title={`Clinical Site: ${selectedSite.name}`}
          subtitle={`${selectedSite.id} • ${selectedSite.city}, ${selectedSite.state}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Accrual</span>
                <span className="text-base font-bold text-teal-800 dark:text-teal-300 font-serif">
                  {selectedSite.currentEnrollmentTotal}
                </span>
                <span className="text-[10px] text-slate-400 block">Target: {selectedSite.targetEnrollmentTotal}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Data Quality</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                  {selectedSite.dataQualityScore}%
                </span>
                <span className="text-[10px] text-slate-400 block">Audit index</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Queries</span>
                <span className="text-base font-bold text-amber-600 font-serif">
                  {selectedSite.pendingQueriesCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Open queries</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Institutional Address:</span>
                <span className="font-semibold text-right max-w-xs">{selectedSite.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Site PI:</span>
                <span className="font-semibold">{selectedSite.principalInvestigator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clinical Research Coordinator:</span>
                <span className="font-semibold">{selectedSite.coordinatorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Site Initiation Visit (SIV):</span>
                <span className="font-mono">{formatDate(selectedSite.sivCompletedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last CRA Monitoring Visit:</span>
                <span className="font-mono">{formatDate(selectedSite.lastMonitoringVisit)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedSite(null)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Onboard Site Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Onboard New Clinical Site"
          subtitle="Add an accredited research hospital or institute into the AIIA network"
        >
          <form onSubmit={handleCreateSite} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={newSite.name}
                onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                placeholder="e.g. Government Ayurvedic College & Hospital"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Site Acronym / Code
                </label>
                <input
                  type="text"
                  required
                  value={newSite.code}
                  onChange={(e) => setNewSite({ ...newSite, code: e.target.value })}
                  placeholder="e.g. GACH-LKO"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 font-mono dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={newSite.city}
                  onChange={(e) => setNewSite({ ...newSite, city: e.target.value })}
                  placeholder="e.g. Lucknow"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={newSite.state}
                  onChange={(e) => setNewSite({ ...newSite, state: e.target.value })}
                  placeholder="e.g. Uttar Pradesh"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Enrollment Capacity
                </label>
                <input
                  type="number"
                  value={newSite.targetEnrollmentTotal}
                  onChange={(e) =>
                    setNewSite({
                      ...newSite,
                      targetEnrollmentTotal: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Site Principal Investigator
                </label>
                <input
                  type="text"
                  required
                  value={newSite.principalInvestigator}
                  onChange={(e) => setNewSite({ ...newSite, principalInvestigator: e.target.value })}
                  placeholder="Prof. (Dr.) V. K. Tripathi"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Coordinator
                </label>
                <input
                  type="text"
                  required
                  value={newSite.coordinatorName}
                  onChange={(e) => setNewSite({ ...newSite, coordinatorName: e.target.value })}
                  placeholder="Dr. Priyanka Verma"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
                />
              </div>
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
                Register Site
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
