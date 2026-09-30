import { User, UserRole } from '../types';

export interface DemoAccount {
  email: string;
  role: UserRole;
  label: string;
  name: string;
  department: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'admin@aiia.gov.in',
    role: 'admin',
    label: 'Admin / AIIA Management',
    name: 'Prof. (Dr.) Tanuja Nesari',
    department: 'Directorate & Clinical Research Central Cell',
    description: 'Full administrative access across all studies, sites, ethics, and system configurations.',
  },
  {
    email: 'pi.anand@aiia.gov.in',
    role: 'pi',
    label: 'Principal Investigator',
    name: 'Dr. Anand More',
    department: 'Department of Kaya Chikitsa (General Medicine)',
    description: 'Lead trial investigator; monitors study-specific recruitment, participant timelines, and safety.',
  },
  {
    email: 'coordinator@aiia.gov.in',
    role: 'coordinator',
    label: 'Study Coordinator',
    name: 'Dr. Divya Aggarwal',
    department: 'AIIA Clinical Trial Center',
    description: 'Patient screening, enrollment, visit logging, randomization, and eCRF queries.',
  },
  {
    email: 'monitor.verma@aiia.gov.in',
    role: 'monitor',
    label: 'Clinical Research Monitor (CRA)',
    name: 'Dr. Rajesh Verma',
    department: 'Quality Assurance & Site Monitoring',
    description: 'SIV, IMV, site audit logs, source data verification, and protocol deviations tracking.',
  },
  {
    email: 'iec.secretariat@aiia.gov.in',
    role: 'ethics',
    label: 'Institutional Ethics Committee',
    name: 'Dr. M. S. Baghel',
    department: 'AIIA Institutional Ethics Secretariat',
    description: 'Reviewing protocol dossiers, approving amendments, and monitoring annual clearances.',
  },
  {
    email: 'pv.officer@aiia.gov.in',
    role: 'safety',
    label: 'Pharmacovigilance (PvPI / Safety)',
    name: 'Dr. Arvind Joshi',
    department: 'Ayurveda Pharmacovigilance Regional Center',
    description: 'AE/SAE/ADR triaging, causality classification, CDSCO expedited regulatory escalation.',
  },
  {
    email: 'regulator.ayush@gov.in',
    role: 'regulator',
    label: 'Regulator / External Auditor',
    name: 'Shri R. K. Srivastava',
    department: 'Ministry of Ayush / CDSCO Inspection Division',
    description: 'Read-only compliance verification, CTRI validation, and formal regulatory reports.',
  },
];

const AUTH_STORAGE_KEY = 'aiia_ctms_auth_user_v1';
const USERS_STORAGE_KEY = 'aiia_ctms_all_users_v1';

export const AuthService = {
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as User;
      }
    } catch {
      // Fallback
    }
    // Default logged in user: Admin for rich first-glance experience
    const defaultUser: User = {
      id: 'usr-admin-01',
      name: 'Prof. (Dr.) Tanuja Nesari',
      email: 'admin@aiia.gov.in',
      role: 'admin',
      department: 'Directorate & Clinical Research Cell',
      institution: 'All India Institute of Ayurveda, New Delhi',
    };
    this.setCurrentUser(defaultUser);
    return defaultUser;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new Event('ctms_auth_changed'));
  },

  switchRole(role: UserRole): User {
    const demo = DEMO_ACCOUNTS.find((d) => d.role === role) || DEMO_ACCOUNTS[0];
    const switchedUser: User = {
      id: `usr-${role}-${Date.now().toString().slice(-4)}`,
      name: demo.name,
      email: demo.email,
      role: demo.role,
      department: demo.department,
      institution: 'All India Institute of Ayurveda, New Delhi',
    };
    this.setCurrentUser(switchedUser);
    return switchedUser;
  },

  login(email: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundDemo = DEMO_ACCOUNTS.find((d) => d.email.toLowerCase() === email.toLowerCase());
        const user: User = {
          id: `usr-${Date.now()}`,
          name: foundDemo ? foundDemo.name : email.split('@')[0].replace('.', ' '),
          email,
          role: foundDemo ? foundDemo.role : 'coordinator',
          department: foundDemo ? foundDemo.department : 'Clinical Research Department',
          institution: 'All India Institute of Ayurveda',
        };
        this.setCurrentUser(user);
        resolve(user);
      }, 350);
    });
  },

  signup(data: { name: string; email: string; role: UserRole; department: string; institution: string }): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: `usr-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          department: data.department || 'Clinical Research',
          institution: data.institution || 'AIIA',
        };
        this.setCurrentUser(user);
        resolve(user);
      }, 400);
    });
  },

  logout(): void {
    this.setCurrentUser(null);
  },
};
