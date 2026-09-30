import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  signup: (data: { name: string; email: string; role: UserRole; department: string; institution: string }) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  canAccess: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => AuthService.getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(AuthService.getCurrentUser());
    };
    window.addEventListener('ctms_auth_changed', handleAuthChange);
    return () => window.removeEventListener('ctms_auth_changed', handleAuthChange);
  }, []);

  const login = async (email: string) => {
    const loggedUser = await AuthService.login(email);
    setUser(loggedUser);
  };

  const signup = async (data: { name: string; email: string; role: UserRole; department: string; institution: string }) => {
    const newUser = await AuthService.signup(data);
    setUser(newUser);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const switched = AuthService.switchRole(newRole);
    setUser(switched);
  };

  const canAccess = (module: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;

    switch (module.toLowerCase()) {
      case 'dashboard':
      case 'notifications':
      case 'settings':
        return true;
      case 'studies':
      case 'study_details':
        return true;
      case 'participants':
      case 'recruitment':
        return ['admin', 'pi', 'coordinator', 'safety'].includes(user.role);
      case 'sites':
      case 'visits':
        return ['admin', 'monitor', 'coordinator', 'pi'].includes(user.role);
      case 'deviations':
      case 'data_quality':
        return ['admin', 'coordinator', 'monitor', 'pi'].includes(user.role);
      case 'safety':
        return ['admin', 'safety', 'pi', 'ethics', 'coordinator', 'regulator'].includes(user.role);
      case 'regulatory':
      case 'ethics':
        return ['admin', 'ethics', 'pi', 'regulator', 'safety'].includes(user.role);
      case 'reports':
        return true;
      case 'audit_trail':
        return ['admin', 'ethics', 'regulator', 'monitor'].includes(user.role);
      default:
        return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'admin',
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchRole,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
