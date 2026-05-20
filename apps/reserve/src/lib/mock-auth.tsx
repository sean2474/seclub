"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  membershipTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  points: number;
}

interface AuthContextType {
  user: MockUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (data: { email: string; password: string; name: string; phone: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 목업 사용자 데이터
const MOCK_USER: MockUser = {
  id: "user-1",
  email: "sean24740@gmail.com",
  name: "박서준",
  phone: "010-1234-5678",
  membershipTier: "GOLD",
  points: 15000,
};

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // 목업: 아무 이메일/비밀번호로 로그인 가능
    await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    if (email && password) {
      setUser({ ...MOCK_USER, email });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const signup = useCallback(async (data: { email: string; password: string; name: string; phone: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (data.email && data.password && data.name) {
      setUser({
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        phone: data.phone,
        membershipTier: "BRONZE",
        points: 0,
      });
      return true;
    }
    return false;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within MockAuthProvider");
  }
  return context;
}
