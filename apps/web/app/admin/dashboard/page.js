"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../components/providers/AdminProvider';
import GlobalAdminDashboard from '../../../components/admin/GlobalAdminDashboard';
import GovernmentDashboard from '../../../components/admin/GovernmentDashboard';
import NGODashboard from '../../../components/admin/NGODashboard';
import { LogOut, Shield } from 'lucide-react';

export default function AdminDashboardPage() {
  const { adminUser, isLoading, logout } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !adminUser) {
      router.push('/admin/login');
    }
  }, [adminUser, isLoading, router]);

  if (isLoading || !adminUser) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Router le bon dashboard
  const renderDashboard = () => {
    switch (adminUser.role) {
      case 'global_admin': return <GlobalAdminDashboard />;
      case 'government': return <GovernmentDashboard />;
      case 'ngo': return <NGODashboard />;
      default: return <div className="text-center p-10">Unknown Role</div>;
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Admin */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{adminUser.organization}</h1>
              <p className="text-slate-500 font-medium capitalize">{adminUser.role.replace('_', ' ')} Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold border border-emerald-200">
              ● System Online
            </div>
            <button 
              onClick={logout}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderDashboard()}
        </main>

      </div>
    </div>
  );
}