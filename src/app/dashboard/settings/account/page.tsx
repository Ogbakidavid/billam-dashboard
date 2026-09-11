'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { usePersona } from '@/app/dashboard/context/PersonaContext';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white border border-[#E7E7E3] rounded-[20px] ${className}`}
    style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
  >
    {children}
  </div>
);

export default function AccountPage() {
  const { currentPersona } = usePersona();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('owner@' + currentPersona.businessName.toLowerCase().replace(/\s+/g, '') + '.com');
  const [name, setName] = useState(currentPersona.businessName + ' Owner');

  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 800);
  };

  return (
    <div className="space-y-4">
      {saved && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#DDFBEA] border border-[#19D66B]/20 rounded-[16px] text-[13px] font-semibold text-[#079A4F]">
          <Icon name="CheckCircleIcon" size={16} className="text-[#19D66B] shrink-0" />
          Account details saved.
        </div>
      )}

      <div>
        <h2 className="text-[18px] font-bold text-[#171817]">Account</h2>
        <p className="text-[12px] text-[#6F716E] mt-0.5">Manage your personal account details and preferences.</p>
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-[#E7E7E3]">
          <h3 className="text-[14px] font-semibold text-[#171817]">Personal Details</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
              <span className="text-[#079A4F] font-bold text-base">{initials}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#171817]">{name}</p>
              <p className="text-[12px] text-[#6F716E]">{email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#171817]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] outline-hidden focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#171817]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] outline-hidden focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all"
            />
          </div>
        </div>
        <div className="px-5 pb-5 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#19D66B] text-white text-[13px] font-semibold rounded-xl hover:bg-[#079A4F] disabled:opacity-60 transition-colors"
            style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
          >
            {saving ? <><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spinner" />Saving…</> : <><Icon name="CheckIcon" size={14} />Save Changes</>}
          </button>
        </div>
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-[#E7E7E3]">
          <h3 className="text-[14px] font-semibold text-[#171817]">Danger Zone</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-[#171817]">Delete Account</p>
              <p className="text-[12px] text-[#6F716E] mt-0.5">Permanently delete your account and all associated data.</p>
            </div>
            <button className="px-4 py-2 text-[13px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors shrink-0">
              Delete Account
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
