"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AdminContext = createContext(undefined);

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing session in localStorage (basic check, real auth is cookie-based on API)
    const storedUser = localStorage.getItem('prevhero_admin_user');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setAdminUser(userData);
    localStorage.setItem('prevhero_admin_user', JSON.stringify(userData));
    router.push('/admin/dashboard');
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('prevhero_admin_user');
    // Call logout API to clear cookie
    router.push('/admin/login');
  };

  return (
    <AdminContext.Provider value={{ adminUser, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);