import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FlaskConical,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit,
  ArrowUpDown,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Calendar,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Study } from '../../types';
import { formatDate } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';

export function StudiesListPage() {
  const { studies, updateStudy } = useData();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [healthFilter, setHealthFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [piFilter, setPiFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'id' | 'title' | 'recruitment' | 'startDate'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Edit Study Modal state
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);

  // Synchronize URL query params (e.g. from Dashboard KPI clicks)
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    const statusParam = searchParams.get('status');

    if (filterParam === 'behind_schedule') {
      setHealthFilter('Behind Schedule');
    }
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  // Unique PIs for filter dropdown
  const uniquePIs = useMemo(() => {
    return Array.from(new Set(studies.map((s) => s.principalInvestigator)));
  }, [studies]);

  // Filtering and Sorting logic
  const filteredStudies = useMemo(() => {
    return studies
      .filter((s) => {
        const matchesSearch =
          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.shortTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
        const matchesHealth =
          healthFilter === 'ALL' ||
          (healthFilter === 'Behind Schedule'
            ? s.health === 'Behind Schedule' || s.health === 'Critical Attention'
            : s.health === healthFilter);
        const matchesType = typeFilter === 'ALL' || s.interventionType === typeFilter;
        const matchesPI = piFilter === 'ALL' || s.principalInvestigator === piFilter;

        return matchesSearch && matchesStatus && matchesHealth && matchesType && matchesPI;
      })
      .sort((a, b) => {
        if (sortField === 'id') {
          return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        }
        if (sortField === 'title') {
          return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        }
        if (sortField === 'recruitment') {
          const rateA = a.currentEnrollment / (a.targetEnrollment || 1);
          const rateB = b.currentEnrollment / (b.targetEnrollment || 1);
          return sortAsc ? rateA - rateB : rateB - rateA;
        }
        if (sortField === 'startDate') {
          return sortAsc
            ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
        return 0;
      });
  }, [studies, searchTerm, statusFilter, healthFilter, typeFilter, piFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredStudies.length / itemsPerPage) || 1;
  const paginatedStudies = filteredStudies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudy) {
      updateStudy(editingStudy);
      setEditingStudy(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & New Study CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
            AIIA Clinical Studies Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Surveillance of all authorized Ayurvedic interventional clinical trials and registries
          </p>
        </div>

        {role !== 'regulator' && (
          <button
            onClick={() => navigate('/studies/new')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Initiate New Study (6-Step)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Study ID, formulation, title, or Principal Investigator..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Quick Clear Button if active filters */}
          {(searchTerm || statusFilter !== 'ALL' || healthFilter !== 'ALL' || typeFilter !== 'ALL' || piFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setHealthFilter('ALL');
                setTypeFilter('ALL');
                setPiFilter('ALL');
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Trial Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Recruiting">Recruiting</option>
              <option value="Active">Active</option>
              <option value="Planned">Planned</option>
              <option value="Completed">Completed</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Health / Schedule
            </label>
            <select
              value={healthFilter}
              onChange={(e) => {
                setHealthFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="ALL">All Health States</option>
              <option value="On Track">On Track</option>
              <option value="Behind Schedule">Behind Schedule / Critical</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Intervention Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="ALL">All Therapies</option>
              <option value="Ayurvedic Formulation">Ayurvedic Formulation</option>
              <option value="Classical Polyherbal">Classical Polyherbal</option>
              <option value="Herbomineral">Herbomineral</option>
              <option value="Panchakarma Procedure">Panchakarma</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Principal Investigator
            </label>
            <select
              value={piFilter}
              onChange={(e) => {
                setPiFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs truncate"
            >
              <option value="ALL">All Investigators</option>
              {uniquePIs.map((pi) => (
                <option key={pi} value={pi}>
                  {pi}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Studies Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                <th
                  onClick={() => {
                    setSortField('id');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Study ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('title');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 min-w-[240px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Title & Formulation</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3">PI & Sponsor</th>
                <th className="py-3.5 px-3">Sites</th>
                <th
                  onClick={() => {
                    setSortField('recruitment');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3.5 px-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Enrollment</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Ethics / CTRI</th>
                <th className="py-3.5 px-3">Health</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No clinical studies match the current search filters.
                  </td>
                </tr>
              ) : (
                paginatedStudies.map((s) => {
                  const recruitmentRate = Math.round(
                    (s.currentEnrollment / (s.targetEnrollment || 1)) * 100
                  );
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-800 dark:text-teal-300">
                        {s.id}
                        <span className="block text-[10px] font-sans font-normal text-slate-400">
                          {s.phase}
                        </span>
                      </td>

                      {/* Title & Short title */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {s.shortTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {s.formulationName}
                        </p>
                      </td>

                      {/* PI */}
                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {s.principalInvestigator}
                        </p>
                        <span className="text-[10px] text-slate-400">{s.sponsor.split(',')[0]}</span>
                      </td>

                      {/* Sites */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.sites.length} sites</span>
                        </div>
                      </td>

                      {/* Recruitment */}
                      <td className="py-3.5 px-3 min-w-[120px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {s.currentEnrollment}/{s.targetEnrollment}
                          </span>
                          <span className="text-slate-500">{recruitmentRate}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              recruitmentRate >= 75
                                ? 'bg-emerald-600'
                                : recruitmentRate >= 40
                                ? 'bg-teal-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(recruitmentRate, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <Badge variant={s.status}>{s.status}</Badge>
                      </td>

                      {/* Ethics / CTRI */}
                      <td className="py-3.5 px-3 text-[11px]">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={
                              s.ethicsStatus === 'Approved'
                                ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                                : 'text-amber-600 font-semibold'
                            }
                          >
                            IEC: {s.ethicsStatus}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {s.ctriNumber || 'Pending Reg'}
                          </span>
                        </div>
                      </td>

                      {/* Health */}
                      <td className="py-3.5 px-3">
                        <Badge variant={s.health}>{s.health}</Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/studies/${s.id}`)}
                            className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40 transition-colors"
                            title="Open Study Workspace"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {role !== 'regulator' && (
                            <button
                              onClick={() => setEditingStudy(s)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit Study Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
          <span className="text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredStudies.length)} of{' '}
            {filteredStudies.length} studies
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 font-medium"
            >
              Previous
            </button>
            <span className="px-2 text-slate-600 dark:text-slate-400 font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Study Modal */}
      {editingStudy && (
        <Modal
          isOpen={!!editingStudy}
          onClose={() => setEditingStudy(null)}
          title={`Edit Trial: ${editingStudy.id}`}
          subtitle="Update trial lifecycle, health assessment, or CTRI metadata"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Title
              </label>
              <textarea
                rows={2}
                value={editingStudy.title}
                onChange={(e) => setEditingStudy({ ...editingStudy, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={editingStudy.status}
                  onChange={(e) => setEditingStudy({ ...editingStudy, status: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 dark:bg-slate-800"
                >
                  <option value="Planned">Planned</option>
                  <option value="Ethics Pending">Ethics Pending</option>
                  <option value="Recruiting">Recruiting</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Health / Trajectory
                </label>
                <select
                  value={editingStudy.health}
                  onChange={(e) => setEditingStudy({ ...editingStudy, health: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 dark:bg-slate-800"
                >
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Behind Schedule">Behind Schedule</option>
                  <option value="Critical Attention">Critical Attention</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Enrollment
                </label>
                <input
                  type="number"
                  value={editingStudy.targetEnrollment}
                  onChange={(e) =>
                    setEditingStudy({
                      ...editingStudy,
                      targetEnrollment: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CTRI Update Deadline
                </label>
                <input
                  type="date"
                  value={editingStudy.ctriNextUpdateDeadline}
                  onChange={(e) =>
                    setEditingStudy({
                      ...editingStudy,
                      ctriNextUpdateDeadline: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingStudy(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
