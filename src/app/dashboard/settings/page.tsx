'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { usePersona } from '@/app/dashboard/context/PersonaContext';
import { BusinessProfile } from '@/app/dashboard/settings/types';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white border border-[#E7E7E3] rounded-[20px] ${className}`}
    style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
  >
    {children}
  </div>
);

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}

function Field({ label, value, onChange, type = 'text', placeholder, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#171817]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] placeholder:text-[#999C98] outline-hidden focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
      />
      {hint && <p className="text-[11px] text-[#999C98]">{hint}</p>}
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, hint }: Omit<FieldProps, 'type'>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#171817]">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] placeholder:text-[#999C98] outline-hidden focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all resize-none"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
      />
      {hint && <p className="text-[11px] text-[#999C98]">{hint}</p>}
    </div>
  );
}

export default function BusinessInformationPage() {
  const { currentPersona } = usePersona();

  const [profile, setProfile] = useState<BusinessProfile>({
    business_name: currentPersona.businessName,
    business_type: 'Event Vendor',
    contact_email: 'hello@' + currentPersona.businessName.toLowerCase().replace(/\s+/g, '') + '.com',
    contact_phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    description: 'We provide premium event decoration, catering, and photography services for weddings, corporate events, and private celebrations across Lagos.',
    website: '',
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof BusinessProfile) => (value: string) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const initials = profile.business_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Saved banner */}
      {saved && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#DDFBEA] border border-[#19D66B]/20 rounded-[16px] text-[13px] font-semibold text-[#079A4F]">
          <Icon name="CheckCircleIcon" size={16} className="text-[#19D66B] shrink-0" />
          Business information saved successfully.
        </div>
      )}

      {/* Business avatar + name */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-[18px] bg-[#DDFBEA] flex items-center justify-center shrink-0"
            style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.15)' }}
          >
            <span className="text-[#079A4F] font-bold text-lg">{initials}</span>
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#171817]">{profile.business_name}</p>
            <p className="text-[12px] text-[#6F716E] mt-0.5">{profile.business_type} · {profile.location}</p>
          </div>
        </div>
      </Card>

      {/* Business details form */}
      <Card>
        <div className="px-5 py-4 border-b border-[#E7E7E3]">
          <h2 className="text-[14px] font-semibold text-[#171817]">Business Details</h2>
          <p className="text-[12px] text-[#6F716E] mt-0.5">This information is used by the agent when responding to clients.</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Business Name"
            value={profile.business_name}
            onChange={set('business_name')}
            placeholder="e.g. Adeyemi Events"
          />
          <Field
            label="Business Type"
            value={profile.business_type}
            onChange={set('business_type')}
            placeholder="e.g. Event Vendor"
            hint="Used to contextualise agent responses"
          />
          <Field
            label="Contact Email"
            value={profile.contact_email}
            onChange={set('contact_email')}
            type="email"
            placeholder="hello@yourbusiness.com"
          />
          <Field
            label="Contact Phone"
            value={profile.contact_phone}
            onChange={set('contact_phone')}
            type="tel"
            placeholder="+234 801 234 5678"
          />
          <Field
            label="Location"
            value={profile.location}
            onChange={set('location')}
            placeholder="e.g. Lagos, Nigeria"
          />
          <Field
            label="Website"
            value={profile.website ?? ''}
            onChange={set('website')}
            type="url"
            placeholder="https://yourbusiness.com"
          />
          <div className="sm:col-span-2">
            <TextAreaField
              label="Business Description"
              value={profile.description}
              onChange={set('description')}
              placeholder="Describe your business, services, and what makes you unique..."
              hint="The agent uses this to introduce your business to clients."
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
            {saving ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spinner" />
                Saving…
              </>
            ) : (
              <>
                <Icon name="CheckIcon" size={14} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}
