'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface JobEditorProps {
  onClose: () => void;
  onSave: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
}

export interface JobFormData {
  client: string;
  phone: string;
  eventType: string;
  date: string;
  venue: string;
  guestCount: string;
  budget: string;
  services: string[];
  specialRequirements: string;
}

const availableServices = [
  'Full Venue Decoration', 'Stage & Backdrop', 'Table Styling', 'Lighting',
  'Floral Decoration', 'Entrance Decor', 'Wedding Photography', 'Portrait Sessions',
  'Corporate Events', 'Catering', 'Sound Systems', 'AV Equipment',
  'Tent & Canopy', 'Furniture Rental', 'Event Planning', 'Bespoke Suits',
];

const defaultData: JobFormData = {
  client: 'Adaeze Okonkwo',
  phone: '+234 801 234 5678',
  eventType: 'Wedding',
  date: '2026-10-15',
  venue: 'Eko Hotel, Victoria Island',
  guestCount: '300',
  budget: '₦850,000',
  services: ['Full Venue Decoration', 'Stage & Backdrop', 'Floral Decoration'],
  specialRequirements: 'White and gold colour scheme. Bride prefers minimalist floral arrangements.',
};

export default function JobEditor({ onClose, onSave, initialData }: JobEditorProps) {
  const [form, setForm] = useState<JobFormData>({ ...defaultData, ...initialData });

  const update = (field: keyof JobFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const inputClass = "w-full px-3 py-2.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] outline-hidden focus:border-[#19D66B] focus:ring-2 focus:ring-[#19D66B]/15 transition-all placeholder:text-[#999C98]";
  const labelClass = "block text-[11px] font-semibold text-[#6F716E] uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:px-4 sm:py-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-xl bg-white sm:border border-t border-[#E7E7E3] sm:rounded-[24px] rounded-t-[24px] flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E7E7E3] shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-[#171817]">Edit Job</h2>
            <p className="text-[12px] text-[#6F716E] mt-0.5">Update job details and requirements</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E]">
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
          {/* Client info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Client Name</label>
              <input className={inputClass} value={form.client} onChange={e => update('client', e.target.value)} placeholder="Client name" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234..." />
            </div>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Event Type</label>
              <input className={inputClass} value={form.eventType} onChange={e => update('eventType', e.target.value)} placeholder="e.g. Wedding, Birthday" />
            </div>
            <div>
              <label className={labelClass}>Event Date</label>
              <input type="date" className={inputClass} value={form.date} onChange={e => update('date', e.target.value)} />
            </div>
          </div>

          {/* Venue + guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Venue / Location</label>
              <input className={inputClass} value={form.venue} onChange={e => update('venue', e.target.value)} placeholder="Venue name or address" />
            </div>
            <div>
              <label className={labelClass}>Guest Count</label>
              <input type="number" className={inputClass} value={form.guestCount} onChange={e => update('guestCount', e.target.value)} placeholder="e.g. 150" />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className={labelClass}>Budget</label>
            <input className={inputClass} value={form.budget} onChange={e => update('budget', e.target.value)} placeholder="e.g. ₦500,000" />
          </div>

          {/* Services */}
          <div>
            <label className={labelClass}>Requested Services</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {availableServices.map(service => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all ${
                    form.services.includes(service)
                      ? 'bg-[#19D66B] text-white'
                      : 'bg-[#F0F0EE] text-[#6F716E] hover:bg-[#E7E7E3]'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Special requirements */}
          <div>
            <label className={labelClass}>Special Requirements</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={form.specialRequirements}
              onChange={e => update('specialRequirements', e.target.value)}
              placeholder="Any special notes or requirements..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-t border-[#E7E7E3] shrink-0 bg-[#FAFAF9] rounded-b-[24px]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[13px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#19D66B] text-white text-[13px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors"
            style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
          >
            <Icon name="CheckIcon" size={14} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
