"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../components/providers/AdminProvider';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      login(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 text-white mb-4 shadow-xl shadow-slate-900/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500">Secure access for organizations</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 shadow-2xl shadow-purple-900/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                placeholder="admin@org.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/admin/request-account" className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1">
              Request access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}