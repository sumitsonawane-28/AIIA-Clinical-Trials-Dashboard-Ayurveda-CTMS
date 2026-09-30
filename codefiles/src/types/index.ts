export type UserRole =
  | 'admin'
  | 'pi'
  | 'coordinator'
  | 'monitor'
  | 'ethics'
  | 'safety'
  | 'regulator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  institution: string;
  avatarUrl?: string;
}

export type StudyPhase = 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV' | 'Observational';
export type StudyStatus = 'Planned' | 'Ethics Pending' | 'Recruiting' | 'Active' | 'Completed' | 'Suspended';
export type StudyHealth = 'On Track' | 'At Risk' | 'Behind Schedule' | 'Critical Attention';
export type InterventionType = 'Ayurvedic Formulation' | 'Herbomineral' | 'Classical Polyherbal' | 'Panchakarma Procedure' | 'Dietary Regimen' | 'Combined Therapy';

export interface SiteRef {
  siteId: string;
  siteName: string;
  investigatorName: string;
  targetEnrollment: number;
  currentEnrollment: number;
  status: 'Planned' | 'Pending Activation' | 'Active' | 'Suspended' | 'Closed';
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completedDate?: string;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'Overdue';
  description?: string;
}

export interface StudyDocument {
  id: string;
  studyId: string;
  name: string;
  title?: string;
  category: 'Protocol' | 'Ethics Approval' | 'CTRI' | 'Consent' | 'Regulatory' | 'Monitoring' | 'Safety';
  version: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  status: 'Approved' | 'Under Review' | 'Draft' | 'Superseded';
}

export interface Study {
  id: string; // e.g. AYU-2026-001
  title: string;
  shortTitle: string;
  studyType: string; // Interventional / Observational
  interventionType: InterventionType;
  formulationName: string;
  phase: StudyPhase;
  sponsor: string;
  principalInvestigator: string;
  piEmail: string;
  status: StudyStatus;
  health: StudyHealth;
  protocolNumber: string;
  objectives: string;
  primaryOutcome: string;
  secondaryOutcomes: string;
  startDate: string;
  expectedEndDate: string;
  // Ethics
  iecName: string;
  iecApprovalNumber: string;
  iecApprovalDate: string;
  iecExpiryDate: string;
  ethicsStatus: 'Approved' | 'Pending Review' | 'Queries Raised' | 'Renewal Required';
  // CTRI
  ctriNumber: string;
  ctriRegistrationDate: string;
  ctriLastUpdate: string;
  ctriNextUpdateDeadline: string;
  ctriStatus: 'Registered & Current' | 'Update Due in <30 Days' | 'Action Required' | 'Pending Registration';
  // Numbers
  targetEnrollment: number;
  currentEnrollment: number;
  screenedCount: number;
  eligibleCount: number;
  completedCount: number;
  dropoutCount: number;
  sites: SiteRef[];
  milestones: Milestone[];
  createdDate: string;
  dataQualityScore?: number;
}

export type ScreeningStatus = 'Screened' | 'Eligible' | 'Ineligible' | 'Withdrawn';
export type RandomizationGroup = 'Verum (Ayurvedic Formulation)' | 'Active Comparator' | 'Placebo Control' | 'Standard Care + Yoga';
export type ParticipantVisitStatus = 'Baseline' | 'Week 2' | 'Week 4' | 'Week 8' | 'Week 12 (Endpoint)' | 'Follow-up Complete' | string;

export interface Participant {
  id: string; // e.g. PT-001-102
  studyId: string;
  siteId: string;
  siteName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  screeningDate?: string;
  screeningStatus?: ScreeningStatus;
  eligibility?: 'Eligible' | 'Excluded' | 'Pending Criteria';
  enrollmentDate?: string;
  randomizationGroup?: RandomizationGroup;
  currentVisitStatus: ParticipantVisitStatus;
  completionStatus?: 'In Study' | 'Completed' | 'Lost to Follow-up' | 'Adverse Event Discontinuation';
  status?: string;
  ayurvedicPrakriti?: string;
  complianceRate?: number;
  assignedArm?: string;
  consentSignedDate?: string;
  screeningEligibilityConfirmed?: boolean;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    bmi?: number;
  };
  visits?: Array<{
    id: string;
    visitNumber: string;
    visitName: string;
    scheduledDate: string;
    actualDate?: string;
    status: string;
    windowDays?: number;
  }>;
  notes?: string;
}

export interface ResearchSite {
  id: string; // e.g. SITE-DEL-01
  name: string;
  code: string;
  city: string;
  state: string;
  address?: string;
  principalInvestigator: string;
  coordinatorName: string;
  activationDate?: string;
  status: 'Planned' | 'Pending Activation' | 'Active' | 'Suspended' | 'Closed' | 'SIV Pending';
  totalAssignedStudies?: number;
  activeStudiesCount?: number;
  targetEnrollmentTotal: number;
  currentEnrollmentTotal: number;
  dataQualityScore: number; // 0-100%
  monitoringStatus?: 'Up to Date' | 'Visit Scheduled' | 'Overdue Visit' | 'Critical Queries';
  lastMonitoringDate?: string;
  lastMonitoringVisit?: string;
  nextMonitoringDate?: string;
  pendingQueriesCount?: number;
  sivCompletedDate?: string;
}

export type Site = ResearchSite;

export interface MonitoringVisit {
  id: string;
  studyId: string;
  siteId: string;
  siteName: string;
  participantId?: string;
  visitNumber?: string;
  visitName?: string;
  actualDate?: string;
  windowDays?: number;
  craVerified?: boolean;
  visitType?: 'Site Initiation (SIV)' | 'Interim Monitoring (IMV)' | 'For-Cause Audit' | 'Closeout Visit (COV)';
  scheduledDate: string;
  completedDate?: string;
  status: string;
  monitorName?: string;
  keyFindings?: string;
  actionItemsCount?: number;
  resolvedItemsCount?: number;
}

export type DeviationSeverity = 'Minor' | 'Major' | 'Critical';
export type DeviationStatus = 'Open' | 'Under Review' | 'Resolved' | 'Reported';

export interface ProtocolDeviation {
  id: string;
  studyId: string;
  siteId: string;
  siteName?: string;
  participantId?: string;
  dateIdentified: string;
  type?: 'Informed Consent' | 'Inclusion/Exclusion' | 'Dosing/Administration' | 'Visit Window Missed' | 'Prohibited Co-medication' | 'Lab Assessment';
  deviationCategory?: string;
  severity: DeviationSeverity;
  description: string;
  status: DeviationStatus | string;
  reportedBy?: string;
  correctiveAction: string;
  preventiveAction?: string;
  resolvedDate?: string;
  reportedToIEC?: boolean;
}

export interface DataQuery {
  id: string;
  studyId: string;
  siteId: string;
  participantId?: string;
  formName: string; // e.g. Prakriti Assessment, Symptom Score, Biochemistry
  fieldName: string;
  description: string;
  raisedBy: string;
  raisedDate: string;
  assignedTo: string;
  status: 'Open' | 'Answered' | 'Resolved' | 'Closed';
  resolutionNote?: string;
}

export type SafetyEventType = 'Adverse Event (AE)' | 'Serious Adverse Event (SAE)' | 'Adverse Drug Reaction (ADR)' | string;
export type SafetySeverity = 'Mild' | 'Moderate' | 'Severe' | 'Life Threatening' | 'Death' | 'Life-Threatening';
export type SafetyStage = 'Report Created' | 'Medical Review' | 'Causality Classification' | 'Regulatory Check' | 'Submitted/Escalated' | 'Resolved';

export interface SafetyReport {
  id: string;
  studyId: string;
  participantId: string;
  siteId?: string;
  siteName?: string;
  eventType: SafetyEventType;
  eventDescription: string;
  onsetDate?: string;
  onsetDateTime?: string;
  reportedDate: string;
  severity: SafetySeverity;
  isSerious: boolean;
  causalityAyurvedaDrug?: 'Definite' | 'Probable' | 'Possible' | 'Unlikely' | 'Unrelated' | string;
  causalityAyurveda?: string;
  stage?: SafetyStage;
  status: string;
  regulatoryDeadline?: string;
  regulatoryReportingDeadline?: string;
  isDeadlineNear?: boolean;
  isOverdue?: boolean;
  actionTaken: string;
  reportedBy?: string;
  outcome?: string;
}

export interface RegulatoryItem {
  id: string;
  studyId: string;
  category: 'Ethics Committee' | 'CTRI' | 'CDSCO/DCGI' | 'GCP Compliance' | 'Annual Safety Report';
  requirement: string;
  dueDate: string;
  responsiblePerson: string;
  status: 'Compliant' | 'Pending Review' | 'Due Soon (<14 Days)' | 'Overdue';
  documentName?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ctri' | 'ethics' | 'monitoring' | 'recruitment' | 'safety' | 'deviation' | 'query' | 'milestone';
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  isRead: boolean;
  linkUrl: string;
  studyId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  userName: string;
  role?: UserRole;
  userRole?: string;
  module: 'Studies' | 'Participants' | 'Sites' | 'Safety' | 'Regulatory' | 'Visits' | 'Deviations' | 'Data Quality' | 'Documents' | string;
  recordId?: string;
  entityId?: string;
  action: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  studyId?: string;
  ipAddress?: string;
}
