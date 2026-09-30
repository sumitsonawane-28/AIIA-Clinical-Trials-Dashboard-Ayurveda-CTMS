import {
  Study,
  Participant,
  ResearchSite,
  MonitoringVisit,
  ProtocolDeviation,
  DataQuery,
  SafetyReport,
  RegulatoryItem,
  NotificationItem,
  AuditLog,
  StudyDocument,
  UserRole,
} from '../types';
import {
  INITIAL_STUDIES,
  INITIAL_SITES,
  INITIAL_PARTICIPANTS,
  INITIAL_SAFETY_REPORTS,
  INITIAL_VISITS,
  INITIAL_DEVIATIONS,
  INITIAL_DATA_QUERIES,
  INITIAL_REGULATORY_ITEMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DOCUMENTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  STUDIES: 'aiia_ctms_studies_v1',
  SITES: 'aiia_ctms_sites_v1',
  PARTICIPANTS: 'aiia_ctms_participants_v1',
  SAFETY: 'aiia_ctms_safety_v1',
  VISITS: 'aiia_ctms_visits_v1',
  DEVIATIONS: 'aiia_ctms_deviations_v1',
  QUERIES: 'aiia_ctms_queries_v1',
  REGULATORY: 'aiia_ctms_regulatory_v1',
  NOTIFICATIONS: 'aiia_ctms_notifications_v1',
  AUDIT: 'aiia_ctms_audit_v1',
  DOCUMENTS: 'aiia_ctms_documents_v1',
  THEME: 'aiia_ctms_theme_v1',
};

// Safe retrieval from localStorage with fallback
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('ctms_data_updated'));
  } catch (err) {
    console.error(`Failed saving ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Reset all to default demo data
  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(INITIAL_STUDIES));
    localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(INITIAL_SITES));
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(INITIAL_PARTICIPANTS));
    localStorage.setItem(STORAGE_KEYS.SAFETY, JSON.stringify(INITIAL_SAFETY_REPORTS));
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(INITIAL_VISITS));
    localStorage.setItem(STORAGE_KEYS.DEVIATIONS, JSON.stringify(INITIAL_DEVIATIONS));
    localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(INITIAL_DATA_QUERIES));
    localStorage.setItem(STORAGE_KEYS.REGULATORY, JSON.stringify(INITIAL_REGULATORY_ITEMS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    window.dispatchEvent(new Event('ctms_data_updated'));
  },

  // Audit Logging
  getAuditLogs(): AuditLog[] {
    return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
  },

  logAction(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.AUDIT, [newLog, ...logs]);
  },

  // Studies
  getStudies(): Study[] {
    return getFromStorage<Study[]>(STORAGE_KEYS.STUDIES, INITIAL_STUDIES);
  },

  getStudyById(id: string): Study | undefined {
    return this.getStudies().find((s) => s.id === id);
  },

  addStudy(study: Study, userName = 'Admin User', role: UserRole = 'admin'): Study {
    const studies = this.getStudies();
    const exists = studies.some((s) => s.id === study.id);
    if (exists) {
      throw new Error(`Study with ID ${study.id} already exists`);
    }
    const updated = [study, ...studies];
    saveToStorage(STORAGE_KEYS.STUDIES, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Studies',
      recordId: study.id,
      action: 'CREATE_STUDY',
      details: `Created new clinical trial: ${study.shortTitle}`,
      newValue: study.title,
    });

    return study;
  },

  updateStudy(study: Study, userName = 'Admin User', role: UserRole = 'admin'): Study {
    const studies = this.getStudies();
    const prev = studies.find((s) => s.id === study.id);
    const updated = studies.map((s) => (s.id === study.id ? study : s));
    saveToStorage(STORAGE_KEYS.STUDIES, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Studies',
      recordId: study.id,
      action: 'UPDATE_STUDY',
      details: `Updated study details for ${study.id}`,
      previousValue: prev?.status,
      newValue: study.status,
    });

    return study;
  },

  // Research Sites
  getSites(): ResearchSite[] {
    return getFromStorage<ResearchSite[]>(STORAGE_KEYS.SITES, INITIAL_SITES);
  },

  getSiteById(id: string): ResearchSite | undefined {
    return this.getSites().find((s) => s.id === id);
  },

  addSite(site: ResearchSite, userName = 'Admin User', role: UserRole = 'admin'): ResearchSite {
    const sites = this.getSites();
    const updated = [...sites, site];
    saveToStorage(STORAGE_KEYS.SITES, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Sites',
      recordId: site.id,
      action: 'ADD_SITE',
      details: `Activated research site: ${site.name} (${site.city})`,
      newValue: site.status,
    });

    return site;
  },

  updateSite(site: ResearchSite, userName = 'Admin User', role: UserRole = 'admin'): ResearchSite {
    const sites = this.getSites();
    const prev = sites.find((s) => s.id === site.id);
    const updated = sites.map((s) => (s.id === site.id ? site : s));
    saveToStorage(STORAGE_KEYS.SITES, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Sites',
      recordId: site.id,
      action: 'UPDATE_SITE',
      details: `Updated site info for ${site.name}`,
      previousValue: prev?.status,
      newValue: site.status,
    });

    return site;
  },

  // Participants
  getParticipants(): Participant[] {
    return getFromStorage<Participant[]>(STORAGE_KEYS.PARTICIPANTS, INITIAL_PARTICIPANTS);
  },

  addParticipant(participant: Participant, userName = 'Coordinator', role: UserRole = 'coordinator'): Participant {
    const participants = this.getParticipants();
    const updated = [participant, ...participants];
    saveToStorage(STORAGE_KEYS.PARTICIPANTS, updated);

    // Increment currentEnrollment if enrolled
    if (participant.eligibility === 'Eligible' && participant.enrollmentDate) {
      const studies = this.getStudies();
      const study = studies.find((s) => s.id === participant.studyId);
      if (study) {
        study.currentEnrollment += 1;
        study.eligibleCount += 1;
        saveToStorage(STORAGE_KEYS.STUDIES, studies);
      }
    }

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Participants',
      recordId: participant.id,
      action: 'ENROLL_PARTICIPANT',
      details: `Screened & Enrolled subject in Study ${participant.studyId} at ${participant.siteName}`,
      newValue: participant.randomizationGroup || 'Screened',
    });

    return participant;
  },

  updateParticipant(participant: Participant, userName = 'Coordinator', role: UserRole = 'coordinator'): Participant {
    const participants = this.getParticipants();
    const prev = participants.find((p) => p.id === participant.id);
    const updated = participants.map((p) => (p.id === participant.id ? participant : p));
    saveToStorage(STORAGE_KEYS.PARTICIPANTS, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Participants',
      recordId: participant.id,
      action: 'UPDATE_PARTICIPANT',
      details: `Updated participant ${participant.id} visit/completion status`,
      previousValue: prev?.currentVisitStatus,
      newValue: participant.currentVisitStatus,
    });

    return participant;
  },

  // Safety Reports
  getSafetyReports(): SafetyReport[] {
    return getFromStorage<SafetyReport[]>(STORAGE_KEYS.SAFETY, INITIAL_SAFETY_REPORTS);
  },

  addSafetyReport(report: SafetyReport, userName = 'Safety Officer', role: UserRole = 'safety'): SafetyReport {
    const reports = this.getSafetyReports();
    const updated = [report, ...reports];
    saveToStorage(STORAGE_KEYS.SAFETY, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Safety',
      recordId: report.id,
      action: 'LOG_SAFETY_REPORT',
      details: `Reported ${report.eventType} in ${report.studyId}: ${report.eventDescription.slice(0, 50)}...`,
      newValue: report.severity,
    });

    // Also create a high priority notification if SAE
    if (report.isSerious) {
      this.addNotification({
        id: `notif-${Date.now()}`,
        title: `URGENT: ${report.eventType} Logged (${report.id})`,
        message: `${report.eventDescription} in participant ${report.participantId} (${report.studyId}). Regulatory check deadline: 24h.`,
        type: 'safety',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        isRead: false,
        linkUrl: '/safety',
        studyId: report.studyId,
      });
    }

    return report;
  },

  updateSafetyReport(report: SafetyReport, userName = 'Safety Officer', role: UserRole = 'safety'): SafetyReport {
    const reports = this.getSafetyReports();
    const prev = reports.find((r) => r.id === report.id);
    const updated = reports.map((r) => (r.id === report.id ? report : r));
    saveToStorage(STORAGE_KEYS.SAFETY, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Safety',
      recordId: report.id,
      action: 'UPDATE_SAFETY_STAGE',
      details: `Advanced ${report.id} to stage ${report.stage}`,
      previousValue: prev?.stage,
      newValue: report.stage,
    });

    return report;
  },

  // Monitoring Visits
  getVisits(): MonitoringVisit[] {
    return getFromStorage<MonitoringVisit[]>(STORAGE_KEYS.VISITS, INITIAL_VISITS);
  },

  addVisit(visit: MonitoringVisit, userName = 'Monitor', role: UserRole = 'monitor'): MonitoringVisit {
    const visits = this.getVisits();
    const updated = [visit, ...visits];
    saveToStorage(STORAGE_KEYS.VISITS, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Visits',
      recordId: visit.id,
      action: 'SCHEDULE_VISIT',
      details: `Scheduled ${visit.visitType} at ${visit.siteName}`,
      newValue: visit.scheduledDate,
    });

    return visit;
  },

  updateVisit(visit: MonitoringVisit, userName = 'Monitor', role: UserRole = 'monitor'): MonitoringVisit {
    const visits = this.getVisits();
    const prev = visits.find((v) => v.id === visit.id);
    const updated = visits.map((v) => (v.id === visit.id ? visit : v));
    saveToStorage(STORAGE_KEYS.VISITS, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Visits',
      recordId: visit.id,
      action: 'UPDATE_VISIT',
      details: `Updated monitoring visit status for ${visit.id}`,
      previousValue: prev?.status,
      newValue: visit.status,
    });

    return visit;
  },

  // Protocol Deviations
  getDeviations(): ProtocolDeviation[] {
    return getFromStorage<ProtocolDeviation[]>(STORAGE_KEYS.DEVIATIONS, INITIAL_DEVIATIONS);
  },

  addDeviation(deviation: ProtocolDeviation, userName = 'Coordinator', role: UserRole = 'coordinator'): ProtocolDeviation {
    const list = this.getDeviations();
    const updated = [deviation, ...list];
    saveToStorage(STORAGE_KEYS.DEVIATIONS, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Deviations',
      recordId: deviation.id,
      action: 'LOG_DEVIATION',
      details: `Reported ${deviation.severity} deviation: ${deviation.type} in ${deviation.studyId}`,
      newValue: deviation.status,
    });

    return deviation;
  },

  updateDeviation(deviation: ProtocolDeviation, userName = 'Monitor', role: UserRole = 'monitor'): ProtocolDeviation {
    const list = this.getDeviations();
    const prev = list.find((d) => d.id === deviation.id);
    const updated = list.map((d) => (d.id === deviation.id ? deviation : d));
    saveToStorage(STORAGE_KEYS.DEVIATIONS, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Deviations',
      recordId: deviation.id,
      action: 'UPDATE_DEVIATION',
      details: `Updated status for deviation ${deviation.id}`,
      previousValue: prev?.status,
      newValue: deviation.status,
    });

    return deviation;
  },

  // Data Queries
  getQueries(): DataQuery[] {
    return getFromStorage<DataQuery[]>(STORAGE_KEYS.QUERIES, INITIAL_DATA_QUERIES);
  },

  addQuery(query: DataQuery, userName = 'Monitor', role: UserRole = 'monitor'): DataQuery {
    const list = this.getQueries();
    const updated = [query, ...list];
    saveToStorage(STORAGE_KEYS.QUERIES, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Data Quality',
      recordId: query.id,
      action: 'RAISE_QUERY',
      details: `Raised data validation query on ${query.formName} - ${query.fieldName}`,
      newValue: query.status,
    });

    return query;
  },

  updateQuery(query: DataQuery, userName = 'Coordinator', role: UserRole = 'coordinator'): DataQuery {
    const list = this.getQueries();
    const prev = list.find((q) => q.id === query.id);
    const updated = list.map((q) => (q.id === query.id ? query : q));
    saveToStorage(STORAGE_KEYS.QUERIES, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Data Quality',
      recordId: query.id,
      action: 'UPDATE_QUERY',
      details: `Updated query ${query.id} status to ${query.status}`,
      previousValue: prev?.status,
      newValue: query.status,
    });

    return query;
  },

  // Regulatory & Ethics
  getRegulatoryItems(): RegulatoryItem[] {
    return getFromStorage<RegulatoryItem[]>(STORAGE_KEYS.REGULATORY, INITIAL_REGULATORY_ITEMS);
  },

  addRegulatoryItem(item: RegulatoryItem, userName = 'Regulatory Officer', role: UserRole = 'regulator'): RegulatoryItem {
    const list = this.getRegulatoryItems();
    const updated = [item, ...list];
    saveToStorage(STORAGE_KEYS.REGULATORY, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Regulatory',
      recordId: item.id,
      action: 'ADD_REGULATORY_ITEM',
      details: `Tracked regulatory milestone: ${item.category} - ${item.requirement}`,
      newValue: item.status,
    });

    return item;
  },

  updateRegulatoryItem(item: RegulatoryItem, userName = 'Regulatory Officer', role: UserRole = 'regulator'): RegulatoryItem {
    const list = this.getRegulatoryItems();
    const prev = list.find((i) => i.id === item.id);
    const updated = list.map((i) => (i.id === item.id ? item : i));
    saveToStorage(STORAGE_KEYS.REGULATORY, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Regulatory',
      recordId: item.id,
      action: 'UPDATE_REGULATORY_ITEM',
      details: `Updated regulatory item ${item.id}`,
      previousValue: prev?.status,
      newValue: item.status,
    });

    return item;
  },

  // Documents
  getDocuments(studyId?: string): StudyDocument[] {
    const docs = getFromStorage<StudyDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    return studyId ? docs.filter((d) => d.studyId === studyId) : docs;
  },

  addDocument(doc: StudyDocument, userName = 'Admin', role: UserRole = 'admin'): StudyDocument {
    const docs = getFromStorage<StudyDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    const updated = [doc, ...docs];
    saveToStorage(STORAGE_KEYS.DOCUMENTS, updated);

    this.logAction({
      userId: 'current-user',
      userName,
      role,
      module: 'Documents',
      recordId: doc.id,
      action: 'UPLOAD_DOCUMENT',
      details: `Uploaded ${doc.category} document: ${doc.name} (v${doc.version}) for ${doc.studyId}`,
      newValue: doc.status,
    });

    return doc;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return getFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  addNotification(notif: NotificationItem): void {
    const list = this.getNotifications();
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, [notif, ...list]);
  },

  markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllNotificationsRead(): void {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, isRead: true }));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },
};
