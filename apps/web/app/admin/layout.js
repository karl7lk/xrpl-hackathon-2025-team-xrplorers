"use client";

import "../globals.css"; // Reuse global styles (Aurora bg is in globals)

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
      {/* Fond Aurora Global pour l'admin aussi */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#FDF8F6]"></div>
        <div className="absolute top-[-10%] right-[20%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-multiply animate-aurora-1"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[100px] mix-blend-multiply animate-aurora-2"></div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}