'use client';

import React from 'react';
import { JobState, JOB_STATE_LABELS, QuoteStatus } from '@/app/dashboard/types';

// ── Canonical status config ────────────────────────────────────────────────────
// JobState values are the canonical backend states.
// Quote-specific statuses (draft, sent, expired) are kept for the Quotes page.

type AllStatusType = JobState | QuoteStatus;

const statusConfig: Record<AllStatusType, { label: string; bg: string; text: string; dot: string }> = {
  // Canonical JobState values
  IDLE:                    { label: 'Idle',              bg: 'bg-[#F0F0EE]',   text: 'text-[#6F716E]',  dot: 'bg-[#999C98]' },
  INGESTING:               { label: 'Ingesting',         bg: 'bg-blue-50',     text: 'text-blue-600',   dot: 'bg-blue-400' },
  REASONING:               { label: JOB_STATE_LABELS.REASONING,               bg: 'bg-blue-50',     text: 'text-blue-600',   dot: 'bg-blue-500' },
  CLARIFYING:              { label: JOB_STATE_LABELS.CLARIFYING,              bg: 'bg-amber-50',    text: 'text-amber-600',  dot: 'bg-amber-500' },
  NEEDS_SME_INPUT:         { label: JOB_STATE_LABELS.NEEDS_SME_INPUT,         bg: 'bg-orange-50',   text: 'text-orange-600', dot: 'bg-orange-500' },
  AWAITING_HUMAN_APPROVAL: { label: JOB_STATE_LABELS.AWAITING_HUMAN_APPROVAL, bg: 'bg-[#DDFBEA]',   text: 'text-[#079A4F]',  dot: 'bg-[#19D66B]' },
  EXECUTED:                { label: JOB_STATE_LABELS.EXECUTED,                bg: 'bg-[#DDFBEA]',   text: 'text-[#079A4F]',  dot: 'bg-[#19D66B]' },
  FAILED_RETRY:            { label: JOB_STATE_LABELS.FAILED_RETRY,            bg: 'bg-red-50',      text: 'text-red-600',    dot: 'bg-red-500' },
  // Quote-specific statuses
  draft:                   { label: 'Draft',             bg: 'bg-[#F0F0EE]',   text: 'text-[#6F716E]',  dot: 'bg-[#999C98]' },
  awaiting_approval:       { label: 'Awaiting Approval', bg: 'bg-[#DDFBEA]',   text: 'text-[#079A4F]',  dot: 'bg-[#19D66B]' },
  sent:                    { label: 'Sent',              bg: 'bg-[#DDFBEA]',   text: 'text-[#079A4F]',  dot: 'bg-[#19D66B]' },
  expired:                 { label: 'Expired',           bg: 'bg-red-50',      text: 'text-red-500',    dot: 'bg-red-400' },
};

export type StatusType = AllStatusType;

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? statusConfig.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${cfg.bg} ${cfg.text} ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
}
