'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { Quote } from '@/app/dashboard/types';
import { formatNGN } from '@/lib/currency';

interface ClientQuoteCardProps {
  quote: Quote;
  intro?: string;
}

export default function ClientQuoteCard({ quote, intro }: ClientQuoteCardProps) {
  const validityDays = quote.validity_days ?? 7;
  const assumptions = quote.assumptions ?? [];

  return (
    <div className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-[#BCEFCF] bg-white shadow-[0_4px_18px_rgba(20,25,20,0.06)]">
      {intro && (
        <div className="border-b border-[#E7E7E3] bg-[#DDFBEA] px-4 py-3 text-[13px] leading-relaxed text-[#171817]">
          {intro}
        </div>
      )}
      <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[14px] font-bold text-[#171817]">Quote summary</p>
            <p className="mt-0.5 text-[11px] text-[#6F716E]">Itemised pricing in Nigerian Naira</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDFBEA] px-2.5 py-1 text-[10px] font-bold text-[#079A4F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#19D66B]" />
            {quote.status === 'sent' ? 'Sent' : 'Approved quote'}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#E7E7E3]">
          <div className="grid grid-cols-[minmax(0,1fr)_48px_112px] gap-2 border-b border-[#E7E7E3] bg-[#FAFAF9] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#999C98]">
            <span>Service</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Amount</span>
          </div>
          {quote.line_items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_48px_112px] gap-2 border-b border-[#F0F0EE] px-3 py-2.5 text-[12px] text-[#171817] last:border-b-0"
            >
              <span className="min-w-0 break-words">{item.name}</span>
              <span className="text-right text-[#6F716E]">{item.quantity}</span>
              <span className="text-right font-semibold">{formatNGN(item.total)}</span>
            </div>
          ))}
          <div className="border-t border-[#E7E7E3] bg-[#FAFAF9] px-3 py-2.5">
            <div className="flex items-center justify-between text-[12px] text-[#6F716E]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#171817]">{formatNGN(quote.subtotal)}</span>
            </div>
            {quote.contingencies.map((contingency) => (
              <div
                key={contingency.id}
                className="mt-1.5 flex items-center justify-between text-[12px] text-[#6F716E]"
              >
                <span>{contingency.label}</span>
                <span className="font-semibold text-[#171817]">
                  {formatNGN(contingency.amount)}
                </span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-[#E7E7E3] pt-3">
              <span className="text-[13px] font-bold text-[#171817]">Total</span>
              <span className="text-[20px] font-bold text-[#079A4F]">{formatNGN(quote.total)}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-xl bg-[#FAFAF9] px-3 py-3 text-[11px] text-[#6F716E] sm:grid-cols-2">
          <p>
            <span className="font-semibold text-[#171817]">Payment:</span>{' '}
            {quote.payment_terms ?? 'Payment terms to be confirmed.'}
          </p>
          <p>
            <span className="font-semibold text-[#171817]">Valid for:</span> {validityDays} days
          </p>
          {assumptions.length > 0 && (
            <p className="sm:col-span-2">
              <span className="font-semibold text-[#171817]">Assumptions:</span>{' '}
              {assumptions.join(' ')}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-[#E7E7E3] bg-[#FAFAF9] px-4 py-3 text-[11px] text-[#6F716E]">
        <Icon name="InformationCircleIcon" size={13} className="text-[#079A4F]" />
        Final pricing is subject to confirmation of the event details and availability.
      </div>
    </div>
  );
}
