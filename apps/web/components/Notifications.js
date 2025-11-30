// apps/web/components/Notifications.js
"use client";

import { useState } from "react";

export default function Notifications({ onBack }) {
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    reminders: true,
  });

  const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-3xl font-bold text-slate-900">Notification Settings</h2>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 space-y-8">
        
        {/* Section Alerts */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔔</span> Alert Channels
          </h3>
          <div className="space-y-4">
            <ToggleItem 
              label="Email Notifications" 
              desc="Receive certificates and weekly summaries."
              active={settings.email} 
              onClick={() => toggle('email')} 
            />
            <ToggleItem 
              label="Push Notifications" 
              desc="Instant alerts when a transaction is validated."
              active={settings.push} 
              onClick={() => toggle('push')} 
            />
            <ToggleItem 
              label="SMS Alerts" 
              desc="Get critical reminders via text message."
              active={settings.sms} 
              onClick={() => toggle('sms')} 
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section Content */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span> Content Preferences
          </h3>
          <div className="space-y-4">
            <ToggleItem 
              label="Health Reminders" 
              desc="Remind me when a vaccine or screening is due."
              active={settings.reminders} 
              onClick={() => toggle('reminders')} 
            />
            <ToggleItem 
              label="Partner Rewards" 
              desc="Notify me about new insurance discounts and offers."
              active={settings.marketing} 
              onClick={() => toggle('marketing')} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function ToggleItem({ label, desc, active, onClick }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
      <div>
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button 
        onClick={onClick}
        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${active ? 'bg-purple-600' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );
}