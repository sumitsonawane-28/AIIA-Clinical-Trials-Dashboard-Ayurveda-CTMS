import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle,
  Building2,
  FileCheck2,
  Table,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';

export function ReportsPage() {
  const { studies, sites, participants, safetyReports, protocolDeviations } = useData();

  const [selectedReportType, setSelectedReportType] = useState('monthly_accrual');
  const [selectedStudyId, setSelectedStudyId] = useState('ALL');
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const reportTypes = [
    {
      id: 'monthly_accrual',
      title: 'Portfolio Recruitment & Accrual Summary',
      description: 'Comprehensive screening conversion, enrollment trajectory, and dropout percentages by site.',
      category: 'Operations',
    },
    {
      id: 'safety_pv',
      title: 'Pharmacovigilance & SAE Surveillance Dossier',
      description: 'Adverse event line-listings, Ayurvedic causality metrics, and CDSCO expedited reporting logs.',
      category: 'Safety',
    },
    {
      id: 'iec_annual',
      title: 'Institutional Ethics Committee (IEC) Annual Review',
      description: 'Trial status report for Institutional Ethics clearances, protocol adherence, and amendment logs.',
      category: 'Regulatory',
    },
    {
      id: 'site_performance',
      title: 'Multi-Center Site Monitoring Scorecard',
      description: 'Accrual rates, data quality index, query aging, and CRA monitoring visit summaries.',
      category: 'Quality',
    },
  ];

  const handleDownload = (format: 'csv' | 'pdf') => {
    setGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      setGenerating(false);
      setDownloadSuccess(true);

      // Trigger dummy CSV download if requested
      if (format === 'csv') {
        const csvContent =
          'data:text/csv;charset=utf-8,Trial_ID,Short_Title,Phase,Target,Enrolled,Status,Quality_Score\n' +
          studies
            .map(
              (s) =>
                `"${s.id}","${s.shortTitle}","${s.phase}",${s.targetEnrollment},${s.currentEnrollment},"${s.status}",${s.dataQualityScore ?? 98}%`
            )
            .join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `AIIA_CTMS_${selectedReportType}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 600);
  };

  const currentStudy = studies.find((s) => s.id === selectedStudyId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-700" />
            <span>Clinical Reporting & Regulatory Dossier Export</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate standardized GCP audit reports, Ayush safety summaries, and executive management metrics
          </p>
        </div>
      </div>

      {/* Main Grid: Selector + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Report Configurator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
              Select Dossier Type
            </h3>

            <div className="space-y-2">
              {reportTypes.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportType(rep.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedReportType === rep.id
                      ? 'border-teal-700 bg-teal-50/50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs">{rep.title}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {rep.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {rep.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Scope (Study Protocol)
                </label>
                <select
                  value={selectedStudyId}
                  onChange={(e) => setSelectedStudyId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="ALL">All Clinical Studies (AIIA Network)</option>
                  {studies.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id}: {s.shortTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reporting Period
                </label>
                <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-xs">
                  <option>Current Fiscal Year (2025 - 2026)</option>
                  <option>Last 6 Months (CTRI Interval)</option>
                  <option>Cumulative Study Lifetime</option>
                </select>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleDownload('csv')}
                  disabled={generating}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{generating ? 'Exporting...' : 'Export Dataset (CSV)'}</span>
                </button>

                <button
                  onClick={() => handleDownload('pdf')}
                  disabled={generating}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Formal PDF Dossier</span>
                </button>

                {downloadSuccess && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold text-center mt-1 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Report generated successfully!</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview of Formatted Report */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header of Report Document */}
            <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif tracking-tight">
                    ALL INDIA INSTITUTE OF AYURVEDA (AIIA)
                  </h2>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Ministry of Ayush, Government of India • Clinical Trial Management System
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-teal-800 dark:text-teal-300 block">
                    GCP AUDIT DOSSIER
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Generated: {formatDate(new Date().toISOString())}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  {reportTypes.find((r) => r.id === selectedReportType)?.title}
                </span>
                <span className="text-slate-500 text-[11px]">
                  Target Scope: {currentStudy ? `${currentStudy.id} - ${currentStudy.shortTitle}` : 'All Institutional Protocols'}
                </span>
              </div>
            </div>

            {/* Document Body depending on selected type */}
            <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
              {/* Executive Summary Stats */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-2 font-mono">
                  1. Executive Portfolio Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Active Protocols</span>
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
                      {studies.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Participants</span>
                    <span className="text-base font-bold text-teal-800 dark:text-teal-300 font-serif">
                      {participants.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Serious AE (SAE)</span>
                    <span className="text-base font-bold text-rose-600 font-serif">
                      {safetyReports.filter((r) => r.isSerious).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Avg Quality Score</span>
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                      96.4%
                    </span>
                  </div>
                </div>
              </div>

              {/* Protocol Table Preview */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-2 font-mono">
                  2. Protocol Accrual Breakdown
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-2.5">Trial ID</th>
                        <th className="p-2.5">Phase</th>
                        <th className="p-2.5">Enrolled / Target</th>
                        <th className="p-2.5">Compliance</th>
                        <th className="p-2.5">IEC Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {studies.map((s) => (
                        <tr key={s.id}>
                          <td className="p-2.5 font-mono font-bold text-teal-800 dark:text-teal-300">{s.id}</td>
                          <td className="p-2.5">{s.phase}</td>
                          <td className="p-2.5">{s.currentEnrollment} / {s.targetEnrollment}</td>
                          <td className="p-2.5 font-bold text-emerald-700">{s.dataQualityScore ?? 98}%</td>
                          <td className="p-2.5">{s.ethicsStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regulatory Sign-off block */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Prepared By:</p>
                  <p>AIIA Central Trial Management Unit (CTMU)</p>
                  <p className="font-mono text-[10px] mt-1">Hash: SHA256-AIIA-CTMS-2026-V8</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Authorized Signatory:</p>
                  <p>Principal Investigator / Director, AIIA</p>
                  <p className="text-[10px] mt-1 text-slate-400">[Digital Signature Verified]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
