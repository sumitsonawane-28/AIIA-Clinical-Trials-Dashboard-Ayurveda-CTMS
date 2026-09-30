import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Main Pages
import { MainDashboard } from '../pages/dashboard/MainDashboard';
import { StudiesListPage } from '../pages/studies/StudiesListPage';
import { AddStudyPage } from '../pages/studies/AddStudyPage';
import { StudyDetailsPage } from '../pages/studies/StudyDetailsPage';
import { ParticipantsPage } from '../pages/participants/ParticipantsPage';
import { SitesPage } from '../pages/sites/SitesPage';
import { RecruitmentPage } from '../pages/recruitment/RecruitmentPage';
import { VisitsPage } from '../pages/visits/VisitsPage';
import { SafetyPage } from '../pages/safety/SafetyPage';
import { RegulatoryPage } from '../pages/regulatory/RegulatoryPage';
import { DataQualityPage } from '../pages/quality/DataQualityPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { AuditTrailPage } from '../pages/audit/AuditTrailPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { ShieldAlert } from 'lucide-react';

function ProtectedRoute({
  children,
  module,
}: {
  children: React.ReactNode;
  module?: string;
}) {
  const { isAuthenticated, canAccess, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (module && !canAccess(module)) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto my-12 shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
          Access Restricted by Role
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your active session role (<strong className="text-slate-800 dark:text-slate-200 uppercase">{role}</strong>) does not hold authorization privilege to access the <strong className="text-teal-700 capitalize">{module}</strong> module.
        </p>
        <p className="text-[11px] text-slate-400">
          Use the quick role selector in the top bar to switch to an authorized role (e.g. Administrator or Principal Investigator).
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected App Routes inside Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute module="dashboard">
              <MainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="studies"
          element={
            <ProtectedRoute module="studies">
              <StudiesListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="studies/new"
          element={
            <ProtectedRoute module="studies">
              <AddStudyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="studies/:id"
          element={
            <ProtectedRoute module="studies">
              <StudyDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="participants"
          element={
            <ProtectedRoute module="participants">
              <ParticipantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="sites"
          element={
            <ProtectedRoute module="sites">
              <SitesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruitment"
          element={
            <ProtectedRoute module="recruitment">
              <RecruitmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="visits"
          element={
            <ProtectedRoute module="visits">
              <VisitsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="safety"
          element={
            <ProtectedRoute module="safety">
              <SafetyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="regulatory"
          element={
            <ProtectedRoute module="regulatory">
              <RegulatoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="quality"
          element={
            <ProtectedRoute module="data_quality">
              <DataQualityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="data-quality"
          element={
            <ProtectedRoute module="data_quality">
              <DataQualityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute module="reports">
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="audit"
          element={
            <ProtectedRoute module="audit_trail">
              <AuditTrailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="audit-trail"
          element={
            <ProtectedRoute module="audit_trail">
              <AuditTrailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute module="notifications">
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute module="settings">
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
