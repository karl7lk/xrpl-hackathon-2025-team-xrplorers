"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';

export default function RequestAccountPage() {
  const [formData, setFormData] = useState({ email: '', organization: '', role: 'ngo', reason: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/auth/request-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl max-w-md border border-white/50">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h2>
          <p className="text-slate-500 mb-8">Our team will review your application. You will receive an email once approved.</p>
          <Link href="/" className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold">Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 shadow-2xl">
        <Link href="/admin/login" className="inline-flex items-center text-slate-500 hover:text-purple-600 mb-6 font-bold text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
        </Link>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Request Access</h1>
        <p className="text-slate-500 mb-8">Join the PrevHero network as an organization.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500" 
            placeholder="Organization Name"
            required
            onChange={e => setFormData({...formData, organization: e.target.value})}
          />
          <input 
            className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500" 
            placeholder="Official Email"
            type="email"
            required
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <select 
            className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
            onChange={e => setFormData({...formData, role: e.target.value})}
          >
            <option value="ngo">NGO / Non-Profit</option>
            <option value="government">Government Agency</option>
            <option value="medical">Medical Institution</option>
          </select>
          <textarea 
            className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none" 
            placeholder="Reason for request..."
            required
            onChange={e => setFormData({...formData, reason: e.target.value})}
          />
          
          <button disabled={status === 'loading'} className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
            {status === 'loading' ? 'Sending...' : <>Send Request <Send className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}