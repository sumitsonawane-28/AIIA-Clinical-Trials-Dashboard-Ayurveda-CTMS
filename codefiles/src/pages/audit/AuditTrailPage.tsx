import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle,
  Clock,
  User,
  Lock,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';

export function AuditTrailPage() {
  const { auditLogs } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const roleStr = log.userRole || log.role || '';
    const entId = log.entityId || log.recordId || '';

    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roleStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesModule && matchesAction;
  });

  const handleExportAuditCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Timestamp,User,Role,Module,Action,Entity_ID,Details,IP_Address\n' +
      filteredLogs
        .map(
          (l) =>
            `"${l.timestamp}","${l.userName}","${l.userRole}","${l.module}","${l.action}","${l.entityId}","${l.details.replace(/"/g, '""')}","${l.ipAddress}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AIIA_CTMS_AuditTrail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
            <History className="w-6 h-6 text-teal-700" />
            <span>21 CFR Part 11 Audit Trail & System Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, time-stamped clinical electronic record audit trail with user identity attribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographic Ledger Verified</span>
          </div>

          <button
            onClick={handleExportAuditCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user, record ID, or change description..."
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs w-full sm:w-auto"
          >
            <option value="ALL">All System Modules</option>
            <option value="Studies">Studies</option>
            <option value="Participants">Participants</option>
            <option value="Safety">Safety / SAE</option>
            <option value="Regulatory">Regulatory / IEC</option>
            <option value="Quality">Data Quality</option>
            <option value="Auth">Authentication</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs w-full sm:w-auto"
          >
            <option value="ALL">All Operations</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="LOGIN">LOGIN</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Timestamp (IST)</th>
                <th className="py-3.5 px-3">User & Credentials</th>
                <th className="py-3.5 px-3">Module</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-3">Target Entity</th>
                <th className="py-3.5 px-4 min-w-[280px]">Change Narrative</th>
                <th className="py-3.5 px-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No audit records matching search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {log.userName}
                      </span>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold uppercase">
                        {log.userRole}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {log.module}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : log.action === 'UPDATE'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-teal-800 dark:text-teal-300">
                      {log.entityId}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {log.details}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-[10px] text-slate-400">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
