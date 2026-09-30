import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export function SettingsPage() {
  const { user, role } = useAuth();
  const { resetData } = useData();

  const [resetConfirm, setResetConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings form state
  const [notificationConfig, setNotificationConfig] = useState({
    saeAlertEmail: true,
    ctriDeadlineSms: true,
    weeklyDigest: false,
    visitWindowAlerts: true,
  });

  const [complianceConfig, setComplianceConfig] = useState({
    saeEscalationHours: 24,
    ctriReminderDays: 30,
    iecRenewalLeadDays: 60,
    twoFactorEnforced: true,
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExecuteReset = () => {
    resetData();
    setResetConfirm(false);
    alert('System data has been reset to original AIIA clinical trial seed dataset.');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-700" />
          <span>System Settings & Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          User identity settings, regulatory escalation thresholds, and enterprise system management
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        {/* User Identity Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
            <User className="w-4 h-4 text-teal-700" />
            <span>Active Operator Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block mt-0.5">
                {user?.name}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">
                {user?.email}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Role & Privilege</span>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-[11px] uppercase">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Regulatory Escalation Thresholds */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-700" />
            <span>Regulatory & GCP Escalation Timelines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Expedited SAE Notice Window (Hours)
              </label>
              <input
                type="number"
                value={complianceConfig.saeEscalationHours}
                onChange={(e) =>
                  setComplianceConfig({
                    ...complianceConfig,
                    saeEscalationHours: parseInt(e.target.value) || 24,
                  })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">CDSCO mandatory limit: 24h</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                CTRI Update Early Warning (Days)
              </label>
              <input
                type="number"
                value={complianceConfig.ctriReminderDays}
                onChange={(e) =>
                  setComplianceConfig({
                    ...complianceConfig,
                    ctriReminderDays: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Alert trigger prior to deadline</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                IEC Annual Renewal Lead Time (Days)
              </label>
              <input
                type="number"
                value={complianceConfig.iecRenewalLeadDays}
                onChange={(e) =>
                  setComplianceConfig({
                    ...complianceConfig,
                    iecRenewalLeadDays: parseInt(e.target.value) || 60,
                  })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 dark:bg-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Ethics dossier preparation window</span>
            </div>
          </div>
        </div>

        {/* System Notifications Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-700" />
            <span>Automated Monitoring Alerts</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationConfig.saeAlertEmail}
                onChange={(e) =>
                  setNotificationConfig({ ...notificationConfig, saeAlertEmail: e.target.checked })
                }
                className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Immediate High-Priority Email on Serious Adverse Event (SAE) Logging
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationConfig.visitWindowAlerts}
                onChange={(e) =>
                  setNotificationConfig({ ...notificationConfig, visitWindowAlerts: e.target.checked })
                }
                className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Participant Visit Window Warning (3 days prior to expiration)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationConfig.ctriDeadlineSms}
                onChange={(e) =>
                  setNotificationConfig({ ...notificationConfig, ctriDeadlineSms: e.target.checked })
                }
                className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                CTRI 6-Monthly Progress Filing Reminders
              </span>
            </label>
          </div>
        </div>

        {/* Database & Seed Reset (Admin/Dev) */}
        <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl p-6 border border-rose-200 dark:border-rose-900 space-y-3">
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200 font-serif flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-600" />
            <span>Enterprise Data Cache & Reset Controls</span>
          </h3>

          <p className="text-xs text-rose-800 dark:text-rose-300">
            Reset local system state back to the standard All India Institute of Ayurveda (AIIA) mock trials dataset.
          </p>

          {!resetConfirm ? (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Seed Data</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-bold text-rose-700">Are you sure? This will wipe unsaved changes.</span>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-3 py-1.5 rounded-lg bg-rose-700 text-white font-bold text-xs"
              >
                Yes, Reset Now
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
              <CheckCircle className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition-all"
          >
            Save System Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
