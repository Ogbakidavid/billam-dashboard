'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { BriefFieldEntry, AuditEvent } from '@/app/dashboard/types';
import { formatTime } from '@/lib/currency';

// ── Default mock data using canonical BriefFieldEntry structure ────────────────
const defaultExtractedFields: BriefFieldEntry[] = [
  { key: 'event_type', label: 'Event Type', value: 'Wedding reception', status: 'confirmed' },
  { key: 'event_date', label: 'Date', value: '15 November 2026', status: 'confirmed' },
  { key: 'venue_location', label: 'Venue', value: 'The Providence, Ikeja', status: 'confirmed' },
  { key: 'guest_count', label: 'Guests', value: '120', status: 'confirmed' },
  { key: 'service', label: 'Service', value: 'Full-service catering', status: 'confirmed' },
  { key: 'budget_range', label: 'Budget', value: '₦350,000 (approx)', status: 'warning' },
  { key: 'catering_pref', label: 'Catering', value: 'Nigerian + continental, vegetarian options', status: 'confirmed' },
  { key: 'special_req', label: 'Special Requests', value: 'Décor & Setup', status: 'confirmed' },
];

const defaultMissingFields: string[] = [];

// ── Default mock audit events using canonical AuditEvent structure ─────────────
const defaultAuditEvents: AuditEvent[] = [
  { id: 'ae-1', type: 'client', label: 'Client message received', timestamp: '2026-09-01T10:30:00Z' },
  { id: 'ae-2', type: 'agent', label: 'Brief updated', timestamp: '2026-09-01T10:31:00Z' },
  { id: 'ae-3', type: 'agent', label: 'Clarification generated', timestamp: '2026-09-01T10:31:10Z' },
  { id: 'ae-4', type: 'agent', label: 'Clarification sent', timestamp: '2026-09-01T10:31:20Z' },
  { id: 'ae-5', type: 'client', label: 'Client response received', timestamp: '2026-09-01T10:32:00Z' },
  { id: 'ae-6', type: 'agent', label: 'Quote generated', timestamp: '2026-09-01T10:35:00Z' },
  { id: 'ae-7', type: 'sme', label: 'Awaiting your approval', timestamp: '' },
];

const statusIcon: Record<string, { icon: string; color: string }> = {
  confirmed: { icon: 'CheckCircleIcon', color: 'text-[#19D66B]' },
  warning: { icon: 'ExclamationCircleIcon', color: 'text-amber-500' },
  missing: { icon: 'XCircleIcon', color: 'text-red-400' },
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden ${className}`}
    style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
  >
    {children}
  </div>
);

interface BriefPanelProps {
  extracted_fields?: BriefFieldEntry[];
  missing_fields?: string[];
  audit_events?: AuditEvent[];
}

export default function BriefPanel({
  extracted_fields = defaultExtractedFields,
  missing_fields = defaultMissingFields,
  audit_events = defaultAuditEvents,
}: BriefPanelProps) {
  // Combine extracted fields with missing fields for display
  // Some fields (like a partial date) can be BOTH present in extracted_fields
  // AND still listed in missing_fields, since they have a value but it's
  // genuinely incomplete. Don't duplicate those — skip any missing_fields
  // key that already has a real entry from extracted_fields.
  const extractedKeys = new Set(extracted_fields.map((f) => f.key));
  const allFields: BriefFieldEntry[] = [
    ...extracted_fields,
    ...missing_fields
      .filter((key) => !extractedKeys.has(key))
      .map((key) => ({
        key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: 'Missing',
        status: 'missing' as const,
      })),
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Missing info card */}
      {missing_fields.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="ExclamationTriangleIcon" size={15} className="text-amber-600" />
            <span className="text-[13px] font-semibold text-amber-800">Missing information</span>
            <span className="ml-auto text-[11px] bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
              {missing_fields.length} field{missing_fields.length > 1 ? 's' : ''}
            </span>
          </div>
          <ul className="space-y-1 mb-3">
            {missing_fields.map((key) => (
              <li key={key} className="text-xs text-amber-700 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </li>
            ))}
          </ul>
          <button className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-1">
            Resolve missing details <Icon name="ArrowRightIcon" size={11} />
          </button>
        </div>
      )}

      {/* Brief card */}
      <Card>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7E7E3] bg-[#FAFAF9]">
          <div>
            <p className="text-[13px] font-semibold text-[#171817]">Client Brief</p>
            <p className="text-[11px] text-[#999C98]">AI-extracted from conversation</p>
          </div>
          <button className="text-[11px] text-[#19D66B] font-semibold hover:text-[#079A4F] transition-colors">
            View full brief
          </button>
        </div>
        <div className="divide-y divide-[#E7E7E3]">
          {allFields.map((field) => {
            const si = statusIcon[field.status];
            return (
              <div key={field.key} className="flex items-center gap-3 px-4 py-2.5">
                <span className="text-[11px] text-[#999C98] w-28 shrink-0">{field.label}</span>
                <span className={`text-[12px] font-medium flex-1 truncate ${field.status === 'missing' ? 'text-red-400 italic' : 'text-[#171817]'}`}>
                  {field.value}
                </span>
                <Icon name={si.icon} size={14} className={si.color} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Agent activity — consumes canonical AuditEvent[] */}
      <Card>
        <div className="px-4 py-3 border-b border-[#E7E7E3] bg-[#FAFAF9]">
          <p className="text-[13px] font-semibold text-[#171817]">Agent Activity</p>
        </div>
        <div className="px-4 py-3 space-y-2.5">
          {audit_events.map((event, i) => {
            const isActive = !event.timestamp;
            const isDone = !!event.timestamp;
            const isLast = i === audit_events.length - 1;
            return (
              <div key={event.id} className="flex items-center gap-3">
                <span className="text-[11px] text-[#999C98] w-16 shrink-0">
                  {event.timestamp ? formatTime(event.timestamp) : '—'}
                </span>
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${isDone && !isLast ? 'bg-[#19D66B]' : isActive || isLast ? 'bg-amber-400' : 'bg-[#E7E7E3]'
                  }`}>
                  {isDone && !isLast ? (
                    <Icon name="CheckIcon" size={8} className="text-white" variant="solid" />
                  ) : (isActive || isLast) ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  ) : null}
                </div>
                <span className={`text-[12px] ${isDone && !isLast ? 'text-[#171817]' : (isActive || isLast) ? 'text-amber-600 font-semibold' : 'text-[#999C98]'
                  }`}>
                  {event.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
