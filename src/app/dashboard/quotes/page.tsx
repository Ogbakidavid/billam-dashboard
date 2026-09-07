'use client';

import React, { useState } from 'react';
import StatusBadge, { StatusType } from '@/app/dashboard/components/StatusBadge';
import Icon from '@/components/ui/AppIcon';
import EmptyState from '@/app/dashboard/components/EmptyState';
import { usePersona } from '@/app/dashboard/context/PersonaContext';
import QuoteEditor from '@/app/dashboard/components/QuoteEditor';

import { formatNGN } from '@/lib/currency';
import { listJobs } from '@/lib/api';
import { useEffect } from 'react';

const tabs = ['All', 'Draft', 'Awaiting Approval', 'Sent', 'Expired'];

const tabFilter: Record<string, StatusType[]> = {
  'All': [],
  'Draft': ['draft'],
  'Awaiting Approval': ['awaiting_approval'],
  'Sent': ['sent'],
  'Expired': ['expired'],
};

interface QuoteRow {
  id: string;
  client: string;
  event: string;
  status: StatusType;
  amount: number;
}

export default function QuotesPage() {
  const { currentPersona } = usePersona();
  const [activeTab, setActiveTab] = useState('All');
  const [editingQuote, setEditingQuote] = useState<{ client: string; event: string } | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listJobs()
      .then((jobs) => {
        // Only jobs that reached a real quote are shown here.
        // NOTE: real jobs have no "client name" field at all — there's
        // no WhatsApp/identity capture upstream, so this is a known
        // display gap, not something fixable on the frontend alone.
        const rows: QuoteRow[] = jobs
          .filter((j) => j.quote)
          .map((j) => {
            const eventTypeField = j.extracted_fields.find((f) => f.key === 'event_type');
            let status: StatusType = 'draft';
            if (j.state === 'AWAITING_HUMAN_APPROVAL') status = 'awaiting_approval';
            else if (j.state === 'EXECUTED') status = 'sent';

            return {
              id: j.id.slice(0, 8),
              client: `Client ${j.id.slice(0, 4)}`,
              event: eventTypeField?.value || j.business_type,
              status,
              amount: j.quote?.total ?? 0,
            };
          });
        setQuotes(rows);
      })
      .catch((err) => console.error('Failed to load quotes:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'All'
    ? quotes
    : quotes.filter((q) => tabFilter[activeTab]?.includes(q.status));

  const getStatus = (q: QuoteRow): StatusType => {
    if (approvedIds.has(q.id)) return 'sent';
    return q.status;
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#171817]">Quotes</h1>
        <p className="text-[12px] text-[#6F716E] mt-0.5">{loading ? 'Loading...' : `${quotes.length} total quotes`} · {currentPersona.label}</p>
      </div>

      {/* Tabs — scrollable on mobile */}
      <div className="flex items-center gap-0 border-b border-[#E7E7E3] overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 ${activeTab === tab
              ? 'text-[#171817] font-semibold border-b-2 border-[#19D66B]'
              : 'text-[#6F716E] hover:text-[#171817] border-b-2 border-transparent'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div
        className="hidden sm:block bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
      >
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E7E7E3] bg-[#FAFAF9]">
          {[
            { label: 'Quote ID', span: 'col-span-2' },
            { label: 'Client', span: 'col-span-3' },
            { label: 'Event', span: 'col-span-3' },
            { label: 'Status', span: 'col-span-2' },
            { label: 'Amount', span: 'col-span-1 text-right' },
            { label: 'Action', span: 'col-span-1 text-right' },
          ].map((h) => (
            <span key={h.label} className={`text-[11px] font-semibold text-[#999C98] uppercase tracking-wider ${h.span}`}>
              {h.label}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="DocumentTextIcon"
            title="No Quotes Yet"
            description="Once quotes are generated, they'll appear here."
          />
        ) : (
          <div className="divide-y divide-[#E7E7E3]">
            {filtered.map((q) => {
              const status = getStatus(q);
              return (
                <div key={q.id} className="grid grid-cols-12 gap-4 items-center px-5 py-3.5 hover:bg-[#FAFAF9] transition-colors group">
                  <span className="col-span-2 text-[11px] font-mono text-[#999C98]">{q.id}</span>
                  <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-[10px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#079A4F]">
                        {q.client.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-[#171817] truncate">{q.client}</span>
                  </div>
                  <span className="col-span-3 text-[13px] text-[#6F716E] truncate">{q.event}</span>
                  <div className="col-span-2"><StatusBadge status={status} size="sm" /></div>
                  <span className="col-span-1 text-[13px] font-semibold text-[#171817] text-right">{formatNGN(q.amount)}</span>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {status === 'awaiting_approval' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingQuote({ client: q.client, event: q.event })}
                          className="p-1.5 rounded-lg hover:bg-[#F0F0EE] text-[#6F716E] hover:text-[#171817] transition-all"
                          title="Edit Quote"
                        >
                          <Icon name="PencilSquareIcon" size={14} />
                        </button>
                        <button
                          onClick={() => setApprovedIds(prev => new Set([...prev, q.id]))}
                          className="p-1.5 rounded-lg hover:bg-[#DDFBEA] text-[#6F716E] hover:text-[#079A4F] transition-all"
                          title="Approve & Send"
                        >
                          <Icon name="CheckCircleIcon" size={14} />
                        </button>
                      </div>
                    )}
                    {status === 'draft' && (
                      <button
                        onClick={() => setEditingQuote({ client: q.client, event: q.event })}
                        className="p-1.5 rounded-lg hover:bg-[#F0F0EE] text-[#6F716E] hover:text-[#171817] transition-all"
                        title="Edit Quote"
                      >
                        <Icon name="PencilSquareIcon" size={14} />
                      </button>
                    )}
                    {(status === 'sent' || status === 'expired') && (
                      <button className="p-1.5 rounded-lg hover:bg-[#F0F0EE] text-[#6F716E] hover:text-[#171817] transition-all" title="View">
                        <Icon name="EyeIcon" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile card stack */}
      <div className="sm:hidden space-y-2">
        {filtered.length === 0 ? (
          <div
            className="bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
          >
            <EmptyState
              icon="DocumentTextIcon"
              title="No Quotes Yet"
              description="Once quotes are generated, they'll appear here."
            />
          </div>
        ) : (
          filtered.map((q) => {
            const status = getStatus(q);
            return (
              <div
                key={q.id}
                className="bg-white border border-[#E7E7E3] rounded-[16px] p-4"
                style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-[12px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-[#079A4F]">
                        {q.client.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#171817] truncate">{q.client}</p>
                      <p className="text-[12px] text-[#6F716E] truncate">{q.event}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[14px] font-bold text-[#171817]">{formatNGN(q.amount)}</span>
                    <StatusBadge status={status} size="sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E7E7E3]">
                  <span className="text-[11px] font-mono text-[#999C98]">{q.id}</span>
                  <div className="flex items-center gap-2">
                    {status === 'awaiting_approval' && (
                      <>
                        <button
                          onClick={() => setEditingQuote({ client: q.client, event: q.event })}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E7E7E3] bg-white text-[#171817] text-[12px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors"
                        >
                          <Icon name="PencilSquareIcon" size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => setApprovedIds(prev => new Set([...prev, q.id]))}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#19D66B] text-white text-[12px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors"
                        >
                          <Icon name="CheckCircleIcon" size={13} />
                          Approve
                        </button>
                      </>
                    )}
                    {status === 'draft' && (
                      <button
                        onClick={() => setEditingQuote({ client: q.client, event: q.event })}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E7E7E3] bg-white text-[#171817] text-[12px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors"
                      >
                        <Icon name="PencilSquareIcon" size={13} />
                        Edit
                      </button>
                    )}
                    {(status === 'sent' || status === 'expired') && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E7E7E3] bg-white text-[#171817] text-[12px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors">
                        <Icon name="EyeIcon" size={13} />
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quote Editor Modal */}
      {editingQuote && (
        <QuoteEditor
          clientName={editingQuote.client}
          eventName={editingQuote.event}
          onClose={() => setEditingQuote(null)}
          onSave={() => setEditingQuote(null)}
        />
      )}
    </div>
  );
}
