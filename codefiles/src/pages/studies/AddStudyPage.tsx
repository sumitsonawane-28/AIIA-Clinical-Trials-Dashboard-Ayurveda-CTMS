import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  FileText,
  FileCheck2,
  Calendar,
  Building2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Study, SiteRef, Milestone } from '../../types';

export function AddStudyPage() {
  const { addStudy, sites: availableSites } = useData();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Info
    id: `AYU-2026-00${Math.floor(Math.random() * 90) + 10}`,
    title: '',
    shortTitle: '',
    studyType: 'Interventional RCT',
    interventionType: 'Ayurvedic Formulation',
    formulationName: '',
    phase: 'Phase III',
    sponsor: 'All India Institute of Ayurveda (AIIA), Ministry of Ayush',
    principalInvestigator: '',
    piEmail: '',

    // Step 2: Protocol
    protocolNumber: `AIIA/CT/2026/0${Math.floor(Math.random() * 90) + 10}`,
    objectives: '',
    primaryOutcome: '',
    secondaryOutcomes: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedEndDate: '2027-06-30',

    // Step 3: Ethics
    iecName: 'Institutional Ethics Committee, AIIA New Delhi',
    iecApprovalNumber: `IEC/AIIA/2026/${Math.floor(Math.random() * 90) + 10}`,
    iecApprovalDate: new Date().toISOString().split('T')[0],
    iecExpiryDate: '2027-04-30',
    ethicsStatus: 'Approved' as const,

    // Step 4: CTRI
    ctriNumber: `CTRI/2026/0${Math.floor(Math.random() * 90) + 10}/06${Math.floor(Math.random() * 9000) + 1000}`,
    ctriRegistrationDate: new Date().toISOString().split('T')[0],
    ctriLastUpdate: new Date().toISOString().split('T')[0],
    ctriNextUpdateDeadline: '2026-12-31',
    ctriStatus: 'Registered & Current' as const,

    // Step 5: Sites
    targetEnrollment: 200,
    sites: [
      {
        siteId: 'SITE-DEL-01',
        siteName: 'AIIA Main Hospital & Research Centre, New Delhi',
        investigatorName: 'Prof. (Dr.) Tanuja Nesari',
        targetEnrollment: 120,
        currentEnrollment: 0,
        status: 'Active' as const,
      },
    ] as SiteRef[],
  });

  const [newSite, setNewSite] = useState<SiteRef>({
    siteId: 'SITE-JAI-02',
    siteName: 'National Institute of Ayurveda (NIA), Jaipur',
    investigatorName: 'Prof. Sanjeev Sharma',
    targetEnrollment: 80,
    currentEnrollment: 0,
    status: 'Active',
  });

  const handleAddSiteToList = () => {
    if (newSite.siteName && newSite.targetEnrollment > 0) {
      setFormData({
        ...formData,
        sites: [...formData.sites, { ...newSite }],
        targetEnrollment: formData.targetEnrollment + newSite.targetEnrollment,
      });
      // reset
      setNewSite({
        siteId: `SITE-${Date.now().toString().slice(-4)}`,
        siteName: '',
        investigatorName: '',
        targetEnrollment: 50,
        currentEnrollment: 0,
        status: 'Active',
      });
    }
  };

  const handleRemoveSite = (index: number) => {
    const updated = formData.sites.filter((_, i) => i !== index);
    const newTotal = updated.reduce((sum, s) => sum + s.targetEnrollment, 0);
    setFormData({
      ...formData,
      sites: updated,
      targetEnrollment: newTotal,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const initialMilestones: Milestone[] = [
      { id: 'm-1', title: 'Protocol Approval & IEC', targetDate: formData.startDate, completedDate: formData.startDate, status: 'Completed' },
      { id: 'm-2', title: 'CTRI Registration Notification', targetDate: formData.ctriRegistrationDate, completedDate: formData.ctriRegistrationDate, status: 'Completed' },
      { id: 'm-3', title: 'Site Initiation & First Participant In (FPI)', targetDate: '2026-10-15', status: 'In Progress' },
      { id: 'm-4', title: '50% Accrual Milestone', targetDate: '2027-01-30', status: 'Upcoming' },
      { id: 'm-5', title: 'Final Database Lock & Analysis', targetDate: formData.expectedEndDate, status: 'Upcoming' },
    ];

    const newStudy: Study = {
      ...formData,
      status: 'Recruiting',
      health: 'On Track',
      currentEnrollment: 0,
      screenedCount: 0,
      eligibleCount: 0,
      completedCount: 0,
      dropoutCount: 0,
      milestones: initialMilestones,
      createdDate: new Date().toISOString().split('T')[0],
      interventionType: formData.interventionType as any,
      phase: formData.phase as any,
    };

    addStudy(newStudy);
    navigate(`/studies/${newStudy.id}`);
  };

  const steps = [
    { num: 1, title: 'Study Info', icon: FlaskConical },
    { num: 2, title: 'Protocol', icon: FileText },
    { num: 3, title: 'Ethics (IEC)', icon: FileCheck2 },
    { num: 4, title: 'CTRI', icon: Calendar },
    { num: 5, title: 'Research Sites', icon: Building2 },
    { num: 6, title: 'Review & Create', icon: CheckCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
            Initiate New Clinical Study
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            6-Step compliance-oriented trial registration workflow for AIIA & affiliated institutions
          </p>
        </div>
        <button
          onClick={() => navigate('/studies')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          Cancel & Return
        </button>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div
                key={st.num}
                onClick={() => st.num < currentStep && setCurrentStep(st.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800'
                    : isCompleted
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isCurrent
                      ? 'bg-teal-700 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span className="text-xs">{st.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Form Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* STEP 1: Study Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Step 1: Basic Clinical Trial Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Study Identification Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g. AYU-2026-007"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trial Phase *
                </label>
                <select
                  value={formData.phase}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                >
                  <option value="Phase I">Phase I (Safety / Tolerability)</option>
                  <option value="Phase II">Phase II (Therapeutic Efficacy Exploratory)</option>
                  <option value="Phase III">Phase III (Confirmatory Multicentric RCT)</option>
                  <option value="Phase IV">Phase IV (Post-marketing Pharmacovigilance)</option>
                  <option value="Observational">Observational / Disease Registry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Scientific Study Title *
              </label>
              <textarea
                rows={2}
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Clinical Evaluation of Pippali Rasayana in Bronchial Asthma (Tamaka Shwasa): A Randomized Controlled Trial"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Public / Short Acronym *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortTitle}
                  onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                  placeholder="e.g. Pippali Rasayana in Tamaka Shwasa (PR-TS)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Intervention Category
                </label>
                <select
                  value={formData.interventionType}
                  onChange={(e) => setFormData({ ...formData, interventionType: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                >
                  <option value="Ayurvedic Formulation">Ayurvedic Formulation</option>
                  <option value="Classical Polyherbal">Classical Polyherbal</option>
                  <option value="Herbomineral">Herbomineral (Rasaushadhi)</option>
                  <option value="Panchakarma Procedure">Panchakarma Procedure</option>
                  <option value="Dietary Regimen">Dietary Regimen (Pathya-Apathya)</option>
                  <option value="Combined Therapy">Combined Therapy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Formulation & Dosage Specification
              </label>
              <input
                type="text"
                required
                value={formData.formulationName}
                onChange={(e) => setFormData({ ...formData, formulationName: e.target.value })}
                placeholder="e.g. Pippali Churna (Piper longum) 2g bid with lukewarm water"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Principal Investigator *
                </label>
                <input
                  type="text"
                  required
                  value={formData.principalInvestigator}
                  onChange={(e) => setFormData({ ...formData, principalInvestigator: e.target.value })}
                  placeholder="e.g. Dr. Rajesh K. Vats, MD (Ayu)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  PI Email
                </label>
                <input
                  type="email"
                  value={formData.piEmail}
                  onChange={(e) => setFormData({ ...formData, piEmail: e.target.value })}
                  placeholder="e.g. rajesh.vats@aiia.gov.in"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Protocol */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Step 2: Protocol Objectives & Scientific Outcomes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Protocol Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.protocolNumber}
                  onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Expected End
                  </label>
                  <input
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Study Objectives *
              </label>
              <textarea
                rows={3}
                required
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="To evaluate clinical efficacy, symptom remission rate, and safety..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Outcome Measure *
              </label>
              <input
                type="text"
                required
                value={formData.primaryOutcome}
                onChange={(e) => setFormData({ ...formData, primaryOutcome: e.target.value })}
                placeholder="Mean percentage change in peak expiratory flow rate (PEFR) at Week 12"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Secondary Outcomes
              </label>
              <input
                type="text"
                value={formData.secondaryOutcomes}
                onChange={(e) => setFormData({ ...formData, secondaryOutcomes: e.target.value })}
                placeholder="Serum IgE levels, quality of life score (AQLQ), incidence of adverse events"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Ethics */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Step 3: Institutional Ethics Committee (IEC) Clearance
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ethics Committee Name *
              </label>
              <input
                type="text"
                required
                value={formData.iecName}
                onChange={(e) => setFormData({ ...formData, iecName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  IEC Approval Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.iecApprovalNumber}
                  onChange={(e) => setFormData({ ...formData, iecApprovalNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Approval Status
                </label>
                <select
                  value={formData.ethicsStatus}
                  onChange={(e) => setFormData({ ...formData, ethicsStatus: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Queries Raised">Queries Raised</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Approval Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.iecApprovalDate}
                  onChange={(e) => setFormData({ ...formData, iecApprovalDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Expiry / Annual Review Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.iecExpiryDate}
                  onChange={(e) => setFormData({ ...formData, iecExpiryDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CTRI */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Step 4: Clinical Trials Registry - India (CTRI) Registration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CTRI Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ctriNumber}
                  onChange={(e) => setFormData({ ...formData, ctriNumber: e.target.value })}
                  placeholder="CTRI/2026/01/061245"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Registration Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.ctriRegistrationDate}
                  onChange={(e) => setFormData({ ...formData, ctriRegistrationDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Last Updated Date
                </label>
                <input
                  type="date"
                  value={formData.ctriLastUpdate}
                  onChange={(e) => setFormData({ ...formData, ctriLastUpdate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Next Mandatory Update Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={formData.ctriNextUpdateDeadline}
                  onChange={(e) => setFormData({ ...formData, ctriNextUpdateDeadline: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-xs sm:text-sm dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Sites */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Step 5: Participating Research Sites & Target Allocation
            </h2>

            {/* List of currently added sites */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Assigned Clinical Sites ({formData.sites.length})
              </label>
              {formData.sites.map((st, idx) => (
                <div
                  key={st.siteId}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-teal-800 dark:text-teal-300 mr-2">
                      {st.siteId}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {st.siteName}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Site PI: {st.investigatorName} • Target: {st.targetEnrollment} participants
                    </p>
                  </div>
                  {formData.sites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSite(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add new site card */}
            <div className="p-4 rounded-2xl border border-dashed border-teal-300 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-950/20 space-y-3">
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                + Add Another Collaborative Site
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Select Site
                  </label>
                  <select
                    value={newSite.siteId}
                    onChange={(e) => {
                      const selected = availableSites.find((s) => s.id === e.target.value);
                      if (selected) {
                        setNewSite({
                          ...newSite,
                          siteId: selected.id,
                          siteName: selected.name,
                          investigatorName: selected.principalInvestigator,
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 dark:bg-slate-800"
                  >
                    {availableSites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Site Target Enrollment
                  </label>
                  <input
                    type="number"
                    value={newSite.targetEnrollment}
                    onChange={(e) =>
                      setNewSite({
                        ...newSite,
                        targetEnrollment: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2 dark:bg-slate-800"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddSiteToList}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Confirm Site Addition</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Review & Create */}
        {currentStep === 6 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Step 6: Review Trial Dossier & Create
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                    {formData.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {formData.shortTitle || formData.title}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                  {formData.phase}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Principal Investigator:</strong>{' '}
                  {formData.principalInvestigator || 'Unassigned'}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Intervention:</strong>{' '}
                  {formData.interventionType}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">IEC Approval:</strong>{' '}
                  {formData.iecApprovalNumber} ({formData.ethicsStatus})
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">CTRI Reg Number:</strong>{' '}
                  {formData.ctriNumber}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Participating Sites:</strong>{' '}
                  {formData.sites.length} centers
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Target Sample Power:</strong>{' '}
                  {formData.targetEnrollment} participants
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-[11px]">
              Upon confirmation, this trial will be registered in the AIIA CTMS core repository and an audit entry will be generated automatically.
            </p>
          </div>
        )}

        {/* Form Stepper Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => s - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-40 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && !formData.title) {
                  alert('Please enter a Study Title before proceeding');
                  return;
                }
                setCurrentStep((s) => s + 1);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-lg shadow-emerald-900/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Register Study & Activate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
