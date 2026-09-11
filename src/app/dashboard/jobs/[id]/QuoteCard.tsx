'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineItem, Contingency } from '@/app/dashboard/types';
import { formatNGN } from '@/lib/currency';

// ── Default mock quote data using canonical LineItem/Contingency fields ─────────
const defaultLineItems: LineItem[] = [
  { id: '1', name: 'Full Venue Decoration',  quantity: 1,  unit_price: 450000, total: 450000 },
  { id: '2', name: 'Stage & Backdrop Setup', quantity: 1,  unit_price: 180000, total: 180000 },
  { id: '3', name: 'Table Styling',          quantity: 30, unit_price: 5000,   total: 150000 },
  { id: '4', name: 'Floral Arrangements',    quantity: 1,  unit_price: 120000, total: 120000 },
  { id: '5', name: 'Lighting Setup',         quantity: 1,  unit_price: 85000,  total: 85000 },
  { id: '6', name: 'Transport & Logistics',  quantity: 1,  unit_price: 35000,  total: 35000 },
];

interface QuoteCardProps {
  onApprove: () => void;
  onEditQuote?: () => void;
  savedTotal?: number | null;
  line_items?: LineItem[];
  total?: number;
  sent?: boolean;
}

export default function QuoteCard({ onApprove, onEditQuote, savedTotal, line_items = defaultLineItems, total: apiTotal, sent = false }: QuoteCardProps) {
  const calculatedTotal = line_items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const total = savedTotal ?? apiTotal ?? calculatedTotal;

  return (
    <div
      className="bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E7E7E3] bg-[#FAFAF9]">
        <div>
          <p className="text-[13px] font-semibold text-[#171817]">{sent ? 'Quote' : 'Draft Quote'}</p>
          <p className="text-[11px] text-[#999C98]">Quote ID: Q-250901-001</p>
        </div>
        <div className="flex items-center gap-2">
          {savedTotal !== null && savedTotal !== undefined && (
            <span className="text-[11px] bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Icon name="PencilSquareIcon" size={11} />
              Edited
            </span>
          )}
          <span className="text-[11px] bg-[#DDFBEA] text-[#079A4F] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19D66B]" />
            {sent ? 'Sent' : 'Awaiting Approval'}
          </span>
        </div>
      </div>

      {/* Line items — using canonical name/quantity/unit_price/total */}
      <div className="px-5 py-4">
        <div className="space-y-0.5 mb-4">
          {line_items.map((item) => {
            const lineTotal = item.quantity * item.unit_price;
            return (
              <div key={item.id} className="flex items-center justify-between py-2 rounded-xl px-2 -mx-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] text-[#171817]">{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-[11px] text-[#999C98] ml-2">
                      {item.quantity} × {formatNGN(item.unit_price)}
                    </span>
                  )}
                </div>
                <span className="text-[13px] font-semibold text-[#171817] shrink-0">{formatNGN(lineTotal)}</span>
              </div>
            );
          })}
        </div>

        {/* Divider + total */}
        <div className="border-t border-[#E7E7E3] pt-3 mb-1">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#171817]">Total</span>
            <span className="text-[22px] font-bold text-[#19D66B]">{formatNGN(total)}</span>
          </div>
        </div>
      </div>

      {/* Quote summary */}
      <div className="mx-5 mb-4 bg-[#FAFAF9] border border-[#E7E7E3] rounded-[14px] px-4 py-3 grid grid-cols-2 gap-y-2">
        <div>
          <p className="text-[10px] text-[#999C98] uppercase tracking-wider font-semibold">Status</p>
            <span className="text-[11px] bg-[#DDFBEA] text-[#079A4F] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19D66B]" />{sent ? 'Sent' : 'Awaiting Approval'}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-[#999C98] uppercase tracking-wider font-semibold">Valid Until</p>
          <p className="text-[12px] font-medium text-[#171817] mt-0.5">15 Sep 2026</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] text-[#999C98] uppercase tracking-wider font-semibold">Payment Terms</p>
          <p className="text-[12px] font-medium text-[#171817] mt-0.5">50% upfront, balance before event</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-[#E7E7E3] bg-[#FAFAF9]">
        {sent ? (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#DDFBEA] text-[#079A4F] text-[13px] font-bold rounded-xl">
            <Icon name="CheckCircleIcon" size={14} />
            Quote sent to client
          </div>
        ) : (
          <>
            <button
              onClick={onEditQuote}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[13px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors"
            >
              <Icon name="PencilSquareIcon" size={14} />
              Edit Quote
            </button>
            <button
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#19D66B] text-white text-[13px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors"
              style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
            >
              <Icon name="CheckCircleIcon" size={14} />
              Approve &amp; Send
            </button>
          </>
        )}
      </div>
    </div>
  );
}
