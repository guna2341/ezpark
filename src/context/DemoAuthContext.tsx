import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'owner' | 'user';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  orgName?: string;
  facilityCount?: number;
  activePlates?: string[];
  fastagLinked?: boolean;
  walletBalance?: number;
}

interface DemoAuthContextType {
  role: UserRole;
  user: UserProfile;
  login: (selectedRole: UserRole, customName?: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  isAuthenticated: boolean;
}

const OWNER_PROFILE: UserProfile = {
  name: 'Rajesh Iyer',
  email: 'rajesh@luxproperties.in',
  role: 'owner',
  orgName: 'Lux Facilities & Parking Hubs',
  facilityCount: 3,
};

const DRIVER_PROFILE: UserProfile = {
  name: 'Ananya Krishnan',
  email: 'ananya.k@gmail.com',
  role: 'user',
  activePlates: ['KA 05 AB 4321', 'MH 12 DE 5567'],
  fastagLinked: true,
  walletBalance: 1450,
};

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'parkez_demo_role';

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'owner' || saved === 'user') ? saved : 'owner';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  const user = role === 'owner' ? OWNER_PROFILE : DRIVER_PROFILE;

  const login = (selectedRole: UserRole, customName?: string) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    if (customName && selectedRole === 'owner') {
      OWNER_PROFILE.name = customName;
    } else if (customName && selectedRole === 'user') {
      DRIVER_PROFILE.name = customName;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setIsAuthenticated(true);
  };

  return (
    <DemoAuthContext.Provider
      value={{
        role,
        user,
        login,
        logout,
        switchRole,
        isAuthenticated,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
}
