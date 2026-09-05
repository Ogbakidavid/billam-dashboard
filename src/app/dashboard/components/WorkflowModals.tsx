'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { JobState, JOB_STATE_LABELS } from '@/app/dashboard/types';
import { formatNGN } from '@/lib/currency';

// ── Resolve Modal ──────────────────────────────────────────────────────────────
interface ResolveModalProps {
  client: string;
  job: string;
  missingInfo?: string;
  onClose: () => void;
  onResolved: () => void;
}

export function ResolveModal({ client, job, missingInfo = 'Missing venue floor plan', onClose, onResolved }: ResolveModalProps) {
  const [note, setNote] = useState('');
  const [resolved, setResolved] = useState(false);

  const handleResolve = () => {
    setResolved(true);
    setTimeout(() => {
      onResolved();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:px-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-xs" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-md bg-white sm:border border-t border-[#E7E7E3] sm:rounded-[24px] rounded-t-[24px] p-5 sm:p-6"
        style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.10)' }}
      >
        {resolved ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#DDFBEA] flex items-center justify-center mx-auto mb-3">
              <Icon name="CheckCircleIcon" size={24} className="text-[#19D66B]" />
            </div>
            <p className="text-[15px] font-bold text-[#171817]">Issue Resolved</p>
            <p className="text-[12px] text-[#6F716E] mt-1">BillAm will continue processing the job.</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-[16px] bg-amber-50 flex items-center justify-center mb-4">
              <Icon name="WrenchScrewdriverIcon" size={22} className="text-amber-500" />
            </div>
            <h2 className="text-[17px] font-bold text-[#171817] mb-1">Resolve Issue</h2>
            <p className="text-[13px] text-[#6F716E] mb-4">{client} · {job}</p>

            <div className="bg-amber-50 border border-amber-200 rounded-[14px] px-4 py-3 mb-4">
              <p className="text-[12px] font-semibold text-amber-700">Needs your input</p>
              <p className="text-[13px] text-amber-800 mt-0.5">{missingInfo}</p>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-[#6F716E] uppercase tracking-wider mb-1.5">Resolution Note</label>
              <textarea
                className="w-full px-3 py-2.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] outline-hidden focus:border-[#19D66B] focus:ring-2 focus:ring-[#19D66B]/15 resize-none placeholder:text-[#999C98]"
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Provide the missing information or instructions for BillAm..."
              />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[13px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleResolve}
                className="flex-1 px-4 py-2.5 bg-amber-500 text-white text-[13px] font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={14} />
                Mark Resolved
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Review Issue Modal ─────────────────────────────────────────────────────────
interface ReviewIssueModalProps {
  client: string;
  job: string;
  onClose: () => void;
  onRetry: () => void;
  onAdjust: () => void;
}

export function ReviewIssueModal({ client, job, onClose, onRetry, onAdjust }: ReviewIssueModalProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      onRetry();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:px-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-xs" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-md bg-white sm:border border-t border-[#E7E7E3] sm:rounded-[24px] rounded-t-[24px] p-5 sm:p-6 max-h-[92vh] overflow-y-auto"
        style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.10)' }}
      >
        {retrying ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3 animate-spin">
              <Icon name="ArrowPathIcon" size={24} className="text-blue-500" />
            </div>
            <p className="text-[15px] font-bold text-[#171817]">Retrying...</p>
            <p className="text-[12px] text-[#6F716E] mt-1">BillAm is attempting to regenerate the quote.</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-[16px] bg-red-50 flex items-center justify-center mb-4">
              <Icon name="ExclamationTriangleIcon" size={22} className="text-red-500" />
            </div>
            <h2 className="text-[17px] font-bold text-[#171817] mb-1">Issue Details</h2>
            <p className="text-[13px] text-[#6F716E] mb-4">{client} · {job}</p>

            <div className="bg-red-50 border border-red-200 rounded-[14px] px-4 py-3 mb-4">
              <p className="text-[12px] font-semibold text-red-700">Failed / Retry</p>
              <p className="text-[13px] text-red-800 mt-0.5">Budget exceeds requested scope. Current estimate is ₦415,000 against a stated budget of ₦280,000.</p>
            </div>

            <div className="bg-[#FAFAF9] border border-[#E7E7E3] rounded-[14px] px-4 py-3 mb-5 space-y-2">
              <p className="text-[11px] font-semibold text-[#999C98] uppercase tracking-wider">Scope Summary</p>
              {['Stage & Backdrop', 'Full Venue Lighting', 'Floral Arrangements', 'Table Styling (40 tables)', 'Entrance Decor'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E7E7E3] shrink-0" />
                  <span className="text-[12px] text-[#6F716E]">{item}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#E7E7E3] flex justify-between">
                <span className="text-[12px] text-[#6F716E]">Estimated total</span>
                <span className="text-[12px] font-bold text-red-600">₦415,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-[#6F716E]">Client budget</span>
                <span className="text-[12px] font-bold text-[#171817]">₦280,000</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 px-3 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[12px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors">
                Cancel
              </button>
              <button
                onClick={onAdjust}
                className="flex-1 px-3 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[12px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors"
              >
                Adjust Scope
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 px-3 py-2.5 bg-[#19D66B] text-white text-[12px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors flex items-center justify-center gap-1.5"
              >
                <Icon name="ArrowPathIcon" size={13} />
                Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Review Quote Modal ─────────────────────────────────────────────────────────
interface ReviewQuoteModalProps {
  client: string;
  job: string;
  amount: number;
  onClose: () => void;
  onApprove: () => void;
  onEdit: () => void;
}

export function ReviewQuoteModal({ client, job, amount, onClose, onApprove, onEdit }: ReviewQuoteModalProps) {
  const lineItems = [
    { description: 'Full Venue Decoration', qty: 1, unitPrice: 450000 },
    { description: 'Stage & Backdrop Setup', qty: 1, unitPrice: 180000 },
    { description: 'Table Styling (30 tables)', qty: 30, unitPrice: 5000 },
    { description: 'Floral Arrangements', qty: 1, unitPrice: 120000 },
    { description: 'Lighting Setup', qty: 1, unitPrice: 85000 },
    { description: 'Transport & Logistics', qty: 1, unitPrice: 35000 },
  ];
  const total = lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:px-4 sm:py-6">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-xs" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-md bg-white sm:border border-t border-[#E7E7E3] sm:rounded-[24px] rounded-t-[24px] flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.10)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E3] shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-[#171817]">Review Quote</h2>
            <p className="text-[12px] text-[#6F716E] mt-0.5">{client} · {job}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E]">
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-1 mb-4">
            {lineItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="min-w-0 mr-3">
                  <span className="text-[13px] text-[#171817]">{item.description}</span>
                  {item.qty > 1 && <span className="text-[11px] text-[#999C98] ml-2">{item.qty} × {fmt(item.unitPrice)}</span>}
                </div>
                <span className="text-[13px] font-semibold text-[#171817] shrink-0">{fmt(item.qty * item.unitPrice)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E7E7E3] pt-3 flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#171817]">Total</span>
            <span className="text-[22px] font-bold text-[#19D66B]">{fmt(total)}</span>
          </div>

          <div className="mt-4 bg-[#FAFAF9] border border-[#E7E7E3] rounded-[14px] px-4 py-3 grid grid-cols-2 gap-y-2">
            {[
              { label: 'Client', value: client },
              { label: 'Event', value: job },
              { label: 'Valid Until', value: '15 Sep 2026' },
              { label: 'Payment Terms', value: '50% upfront' },
            ].map(row => (
              <div key={row.label}>
                <p className="text-[10px] text-[#999C98] uppercase tracking-wider font-semibold">{row.label}</p>
                <p className="text-[12px] font-medium text-[#171817] mt-0.5">{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-[#E7E7E3] shrink-0 bg-[#FAFAF9] rounded-b-[24px]">
          <button onClick={onEdit} className="flex-1 px-4 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[13px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors flex items-center justify-center gap-2">
            <Icon name="PencilSquareIcon" size={14} />
            Edit Quote
          </button>
          <button
            onClick={onApprove}
            className="flex-1 px-4 py-2.5 bg-[#19D66B] text-white text-[13px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors flex items-center justify-center gap-2"
            style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
          >
            <Icon name="CheckCircleIcon" size={14} />
            Approve &amp; Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Job View Modal ─────────────────────────────────────────────────────────────
interface ViewJobModalProps {
  client: string;
  job: string;
  summary: string;
  detail: string;
  /** Numeric NGN amount */
  amount: number;
  /** Canonical JobState */
  status: JobState;
  onClose: () => void;
  onNavigate: () => void;
}

export function ViewJobModal({ client, job, summary, detail, amount, status, onClose, onNavigate }: ViewJobModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:px-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-xs" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-sm bg-white sm:border border-t border-[#E7E7E3] sm:rounded-[24px] rounded-t-[24px] p-5 sm:p-6"
        style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.10)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-[12px] bg-[#DDFBEA] flex items-center justify-center">
            <span className="text-[#079A4F] font-bold text-sm">
              {client.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E]">
            <Icon name="XMarkIcon" size={16} />
          </button>
        </div>

        <h2 className="text-[16px] font-bold text-[#171817]">{client}</h2>
        <p className="text-[13px] text-[#6F716E] mt-0.5">{job}</p>

        <div className="mt-4 space-y-2.5">
          {[
            { label: 'Summary', value: summary },
            { label: 'Status', value: JOB_STATE_LABELS[status] ?? status },
            { label: 'Amount', value: formatNGN(amount) },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[12px] text-[#6F716E]">{row.label}</span>
              <span className="text-[12px] font-semibold text-[#171817]">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[13px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors">
            Close
          </button>
          <button
            onClick={onNavigate}
            className="flex-1 px-4 py-2.5 bg-[#19D66B] text-white text-[13px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="ArrowRightIcon" size={14} />
            Open Job
          </button>
        </div>
      </div>
    </div>
  );
}
