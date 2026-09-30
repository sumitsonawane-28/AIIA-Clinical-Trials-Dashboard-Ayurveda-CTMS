import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
} from '../types';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface DataContextType {
  studies: Study[];
  sites: ResearchSite[];
  participants: Participant[];
  safetyReports: SafetyReport[];
  visits: MonitoringVisit[];
  deviations: ProtocolDeviation[];
  protocolDeviations: ProtocolDeviation[];
  queries: DataQuery[];
  dataQueries: DataQuery[];
  regulatoryItems: RegulatoryItem[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  documents: StudyDocument[];
  unreadNotificationsCount: number;

  // Study CRUD
  addStudy: (study: Study) => void;
  updateStudy: (study: Study) => void;
  getStudy: (id: string) => Study | undefined;

  // Participant CRUD
  addParticipant: (participant: Participant) => void;
  updateParticipant: (participant: Participant) => void;

  // Site CRUD
  addSite: (site: ResearchSite) => void;
  updateSite: (site: ResearchSite) => void;

  // Safety CRUD
  addSafetyReport: (report: SafetyReport) => void;
  updateSafetyReport: (report: SafetyReport) => void;

  // Visit CRUD
  addVisit: (visit: MonitoringVisit) => void;
  updateVisit: (visit: MonitoringVisit) => void;

  // Deviation CRUD
  addDeviation: (deviation: ProtocolDeviation) => void;
  addProtocolDeviation: (deviation: ProtocolDeviation) => void;
  updateDeviation: (deviation: ProtocolDeviation) => void;

  // Query CRUD
  addQuery: (query: DataQuery) => void;
  updateQuery: (query: DataQuery) => void;

  // Regulatory CRUD
  addRegulatoryItem: (item: RegulatoryItem) => void;
  updateRegulatoryItem: (item: RegulatoryItem) => void;

  // Documents
  addDocument: (doc: StudyDocument) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // System
  resetAllData: () => void;
  resetData: () => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [studies, setStudies] = useState<Study[]>(() => StorageService.getStudies());
  const [sites, setSites] = useState<ResearchSite[]>(() => StorageService.getSites());
  const [participants, setParticipants] = useState<Participant[]>(() => StorageService.getParticipants());
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>(() => StorageService.getSafetyReports());
  const [visits, setVisits] = useState<MonitoringVisit[]>(() => StorageService.getVisits());
  const [deviations, setDeviations] = useState<ProtocolDeviation[]>(() => StorageService.getDeviations());
  const [queries, setQueries] = useState<DataQuery[]>(() => StorageService.getQueries());
  const [regulatoryItems, setRegulatoryItems] = useState<RegulatoryItem[]>(() => StorageService.getRegulatoryItems());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [documents, setDocuments] = useState<StudyDocument[]>(() => StorageService.getDocuments());

  const refreshData = useCallback(() => {
    setStudies(StorageService.getStudies());
    setSites(StorageService.getSites());
    setParticipants(StorageService.getParticipants());
    setSafetyReports(StorageService.getSafetyReports());
    setVisits(StorageService.getVisits());
    setDeviations(StorageService.getDeviations());
    setQueries(StorageService.getQueries());
    setRegulatoryItems(StorageService.getRegulatoryItems());
    setNotifications(StorageService.getNotifications());
    setAuditLogs(StorageService.getAuditLogs());
    setDocuments(StorageService.getDocuments());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      refreshData();
    };
    window.addEventListener('ctms_data_updated', handleStorageChange);
    return () => window.removeEventListener('ctms_data_updated', handleStorageChange);
  }, [refreshData]);

  const userName = user?.name || 'Authorized User';
  const userRole = user?.role || 'admin';

  const addStudy = (study: Study) => {
    try {
      StorageService.addStudy(study, userName, userRole);
      refreshData();
      showToast(`Study ${study.id} created successfully!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Error creating study', 'error');
    }
  };

  const updateStudy = (study: Study) => {
    StorageService.updateStudy(study, userName, userRole);
    refreshData();
    showToast(`Study ${study.id} updated successfully`, 'success');
  };

  const getStudy = (id: string) => {
    return studies.find((s) => s.id === id);
  };

  const addParticipant = (participant: Participant) => {
    StorageService.addParticipant(participant, userName, userRole);
    refreshData();
    showToast(`Participant ${participant.id} registered & recorded`, 'success');
  };

  const updateParticipant = (participant: Participant) => {
    StorageService.updateParticipant(participant, userName, userRole);
    refreshData();
    showToast(`Participant ${participant.id} updated`, 'info');
  };

  const addSite = (site: ResearchSite) => {
    StorageService.addSite(site, userName, userRole);
    refreshData();
    showToast(`Research site ${site.name} added`, 'success');
  };

  const updateSite = (site: ResearchSite) => {
    StorageService.updateSite(site, userName, userRole);
    refreshData();
    showToast(`Research site ${site.name} updated`, 'info');
  };

  const addSafetyReport = (report: SafetyReport) => {
    StorageService.addSafetyReport(report, userName, userRole);
    refreshData();
    showToast(`${report.eventType} (${report.id}) logged successfully`, report.isSerious ? 'warning' : 'info');
  };

  const updateSafetyReport = (report: SafetyReport) => {
    StorageService.updateSafetyReport(report, userName, userRole);
    refreshData();
    showToast(`Safety report ${report.id} updated to stage: ${report.stage}`, 'info');
  };

  const addVisit = (visit: MonitoringVisit) => {
    StorageService.addVisit(visit, userName, userRole);
    refreshData();
    showToast(`Monitoring visit scheduled for ${visit.scheduledDate}`, 'success');
  };

  const updateVisit = (visit: MonitoringVisit) => {
    StorageService.updateVisit(visit, userName, userRole);
    refreshData();
    showToast(`Monitoring visit updated`, 'info');
  };

  const addDeviation = (deviation: ProtocolDeviation) => {
    StorageService.addDeviation(deviation, userName, userRole);
    refreshData();
    showToast(`Protocol deviation ${deviation.id} logged`, deviation.severity === 'Critical' ? 'error' : 'warning');
  };

  const updateDeviation = (deviation: ProtocolDeviation) => {
    StorageService.updateDeviation(deviation, userName, userRole);
    refreshData();
    showToast(`Deviation ${deviation.id} status updated`, 'info');
  };

  const addQuery = (query: DataQuery) => {
    StorageService.addQuery(query, userName, userRole);
    refreshData();
    showToast(`Data query ${query.id} generated`, 'info');
  };

  const updateQuery = (query: DataQuery) => {
    StorageService.updateQuery(query, userName, userRole);
    refreshData();
    showToast(`Query ${query.id} updated`, 'info');
  };

  const addRegulatoryItem = (item: RegulatoryItem) => {
    StorageService.addRegulatoryItem(item, userName, userRole);
    refreshData();
    showToast(`Regulatory requirement added`, 'success');
  };

  const updateRegulatoryItem = (item: RegulatoryItem) => {
    StorageService.updateRegulatoryItem(item, userName, userRole);
    refreshData();
    showToast(`Regulatory item status updated`, 'info');
  };

  const addDocument = (doc: StudyDocument) => {
    StorageService.addDocument(doc, userName, userRole);
    refreshData();
    showToast(`Document "${doc.name}" uploaded successfully`, 'success');
  };

  const markNotificationRead = (id: string) => {
    StorageService.markNotificationRead(id);
    refreshData();
  };

  const markAllNotificationsRead = () => {
    StorageService.markAllNotificationsRead();
    refreshData();
    showToast('All notifications marked as read', 'info');
  };

  const resetAllData = () => {
    StorageService.resetAllData();
    refreshData();
    showToast('All CTMS records reset to initial AIIA clinical data', 'info');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DataContext.Provider
      value={{
        studies,
        sites,
        participants,
        safetyReports,
        visits,
        deviations,
        protocolDeviations: deviations,
        queries,
        dataQueries: queries,
        regulatoryItems,
        notifications,
        auditLogs,
        documents,
        unreadNotificationsCount,

        addStudy,
        updateStudy,
        getStudy,

        addParticipant,
        updateParticipant,

        addSite,
        updateSite,

        addSafetyReport,
        updateSafetyReport,

        addVisit,
        updateVisit,

        addDeviation,
        addProtocolDeviation: addDeviation,
        updateDeviation,

        addQuery,
        updateQuery,

        addRegulatoryItem,
        updateRegulatoryItem,

        addDocument,

        markNotificationRead,
        markAllNotificationsRead,

        resetAllData,
        resetData: resetAllData,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
