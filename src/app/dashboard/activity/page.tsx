'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import EmptyState from '@/app/dashboard/components/EmptyState';
import { AuditEvent, AuditEventType } from '@/app/dashboard/types';
import { formatTime } from '@/lib/currency';

// Canonical AuditEvent mock data — uses ISO timestamps
const allActivity: AuditEvent[] = [
  { id: 'ae-01',  type: 'sme',    label: 'Quote awaiting SME approval',           detail: 'Sarah Adeyemi · ed-job-001 · ₦507,000',      timestamp: '2026-09-01T10:09:00Z' },
  { id: 'ae-02',  type: 'agent',  label: 'Draft quote generated',                 detail: 'Sarah Adeyemi · ₦507,000',                   timestamp: '2026-09-01T10:08:00Z' },
  { id: 'ae-03',  type: 'client', label: 'Client responded with budget range',    detail: 'Sarah Adeyemi · ₦350,000–₦400,000',          timestamp: '2026-09-01T10:06:00Z' },
  { id: 'ae-04',  type: 'agent',  label: 'Clarification sent to client',          detail: 'Sarah Adeyemi · 1 question',                 timestamp: '2026-09-01T10:04:00Z' },
  { id: 'ae-05',  type: 'client', label: 'New client message received',           detail: 'Sarah Adeyemi · Wedding Catering',           timestamp: '2026-09-01T10:02:00Z' },
  { id: 'ae-06',  type: 'agent',  label: 'Brief updated — 5 fields extracted',   detail: 'Michael Okoro · Event Decoration',           timestamp: '2026-09-01T09:45:00Z' },
  { id: 'ae-07',  type: 'system', label: 'Job created',                           detail: 'Michael Okoro · ed-job-002',                 timestamp: '2026-09-01T09:30:00Z' },
  { id: 'ae-08',  type: 'sme',    label: 'Quote approved and sent',               detail: 'Tunde Bello · ₦85,000',                     timestamp: '2026-09-01T08:15:00Z' },
  { id: 'ae-09',  type: 'agent',  label: 'Quote generation failed — budget mismatch', detail: 'David James · ed-job-003',              timestamp: '2026-08-31T23:30:00Z' },
  { id: 'ae-10',  type: 'client', label: 'Client message received',               detail: 'David James · Corporate Launch',            timestamp: '2026-08-31T22:00:00Z' },
  { id: 'ae-11',  type: 'agent',  label: 'Clarification completed',               detail: 'Amaka Nwosu · Birthday Catering',           timestamp: '2026-08-31T18:00:00Z' },
  { id: 'ae-12',  type: 'sme',    label: 'Quote edited by SME',                   detail: 'Ngozi Okafor · Photography · ₦320,000',     timestamp: '2026-08-31T15:00:00Z' },
];

const filters = ['All', 'Agent', 'Client', 'SME', 'System'];

const typeConfig: Record<AuditEventType, { icon: string; color: string; bg: string; label: string }> = {
  agent:  { icon: 'SparklesIcon',       color: 'text-[#19D66B]', bg: 'bg-[#DDFBEA]', label: 'Agent' },
  client: { icon: 'ChatBubbleLeftIcon', color: 'text-blue-600',  bg: 'bg-blue-50',   label: 'Client' },
  sme:    { icon: 'UserCircleIcon',     color: 'text-amber-600', bg: 'bg-amber-50',  label: 'SME' },
  system: { icon: 'CpuChipIcon',        color: 'text-[#6F716E]', bg: 'bg-[#F0F0EE]', label: 'System' },
};

/** Format ISO timestamp to a date label like "Sep 1, 2026" */
function formatDate(timestamp: string): string {
  try {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return timestamp;
  }
}

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? allActivity
    : allActivity.filter((a) => a.type === activeFilter.toLowerCase());

  let lastDate = '';

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-[900px]">
      <div>
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#171817]">Activity</h1>
        <p className="text-[12px] text-[#6F716E] mt-0.5">Full audit trail of all events</p>
      </div>

      {/* Filters — scrollable on mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeFilter === f
                ? 'bg-[#19D66B] text-white'
                : 'bg-white border border-[#E7E7E3] text-[#6F716E] hover:text-[#171817] hover:bg-[#F0F0EE]'
            }`}
            style={activeFilter !== f ? { boxShadow: '0 1px 3px rgba(20,25,20,0.04)' } : {}}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="ClockIcon"
          title="No Activity"
          description="Activity timeline will show important events here."
        />
      ) : (
        <div
          className="bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
        >
          {filtered.map((entry, i) => {
            const cfg = typeConfig[entry.type] ?? typeConfig.system;
            const dateLabel = formatDate(entry.timestamp);
            const showDate = dateLabel !== lastDate;
            lastDate = dateLabel;

            return (
              <React.Fragment key={entry.id}>
                {showDate && (
                  <div className="px-4 sm:px-5 py-2 bg-[#FAFAF9] border-b border-[#E7E7E3]">
                    <span className="text-[11px] font-semibold text-[#999C98] uppercase tracking-wider">{dateLabel}</span>
                  </div>
                )}
                <div className={`flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-[#FAFAF9] transition-colors ${i < filtered.length - 1 ? 'border-b border-[#E7E7E3]' : ''}`}>
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
                    <Icon name={cfg.icon} size={15} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[13px] font-medium text-[#171817]">{entry.label}</span>
                    </div>
                    {entry.detail && (
                      <p className="text-[12px] text-[#999C98] mt-0.5 truncate">{entry.detail}</p>
                    )}
                  </div>

                  {/* Time — derived from ISO timestamp */}
                  <span className="text-[11px] text-[#999C98] shrink-0 mt-0.5">{formatTime(entry.timestamp)}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
