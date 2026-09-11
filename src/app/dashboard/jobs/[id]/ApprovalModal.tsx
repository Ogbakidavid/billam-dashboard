'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { formatNGN } from '@/lib/currency';

interface ApprovalModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  clientName: string;
  eventName: string;
  total: number;
  validUntil?: string;
}

export default function ApprovalModal({ onConfirm, onCancel, clientName, eventName, total, validUntil = '—' }: ApprovalModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:px-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-xs" onClick={onCancel} />
      <div
        className="relative w-full sm:max-w-md bg-white sm:border border-t border-[#E7E7E3] sm:rounded-[24px] rounded-t-[24px] p-5 sm:p-6 animate-[chatBubbleIn_0.3s_ease_forwards]"
        style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.10)' }}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-[16px] bg-[#DDFBEA] flex items-center justify-center mb-4">
          <Icon name="PaperAirplaneIcon" size={22} className="text-[#19D66B]" />
        </div>

        <h2 className="text-[17px] font-bold text-[#171817] mb-1">Ready to send?</h2>
        <p className="text-[13px] text-[#6F716E] mb-5">
          You&apos;re about to send a <span className="font-semibold text-[#171817]">{formatNGN(total)}</span> quote to {clientName}.
        </p>

        {/* Summary */}
        <div className="bg-[#FAFAF9] border border-[#E7E7E3] rounded-[16px] p-4 space-y-2.5 mb-5">
          {[
            { label: 'Client',      value: clientName },
            { label: 'Event',       value: eventName },
            { label: 'Total',       value: formatNGN(total) },
            { label: 'Valid until', value: validUntil },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[12px] text-[#6F716E]">{row.label}</span>
              <span className="text-[12px] font-semibold text-[#171817]">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[13px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors"
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-[#19D66B] text-white text-[13px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors flex items-center justify-center gap-2"
            style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
          >
            <Icon name="CheckCircleIcon" size={15} />
            Approve &amp; Send
          </button>
        </div>
      </div>
    </div>
  );
}
