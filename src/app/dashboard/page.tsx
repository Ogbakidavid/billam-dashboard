'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import MetricCard from '@/app/dashboard/components/MetricCard';
import StatusBadge, { StatusType } from '@/app/dashboard/components/StatusBadge';
import Icon from '@/components/ui/AppIcon';
import AlertBanner from '@/app/dashboard/components/AlertBanner';
import { usePersona } from '@/app/dashboard/context/PersonaContext';
import QuoteEditor from '@/app/dashboard/components/QuoteEditor';
import JobEditor from '@/app/dashboard/components/JobEditor';
import { ResolveModal, ReviewIssueModal, ReviewQuoteModal, ViewJobModal } from '@/app/dashboard/components/WorkflowModals';
import ApprovalModal from '@/app/dashboard/jobs/[id]/ApprovalModal';
import { JobState } from '@/app/dashboard/types';
import { formatNGN } from '@/lib/currency';


const chartData = [
  { month: 'Mar', quotes: 12, jobs: 18 },
  { month: 'Apr', quotes: 19, jobs: 24 },
  { month: 'May', quotes: 15, jobs: 20 },
  { month: 'Jun', quotes: 22, jobs: 28 },
  { month: 'Jul', quotes: 28, jobs: 35 },
  { month: 'Aug', quotes: 24, jobs: 31 },
  { month: 'Sep', quotes: 31, jobs: 38 },
];

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white border border-[#E7E7E3] rounded-[20px] ${className}`}
    style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
  >
    {children}
  </div>
);

type ModalType = 'review_quote' | 'edit_quote' | 'edit_job' | 'resolve' | 'review_issue' | 'view' | 'approve' | null;

interface ModalState {
  type: ModalType;
  itemId: string;
  client: string;
  job: string;
  summary: string;
  detail: string;
  amount: number;
  status: string;
}

export default function DashboardPage() {
  const { currentPersona } = usePersona();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [retriedIds, setRetriedIds] = useState<Set<string>>(new Set());

  const openModal = (type: ModalType, item: typeof currentPersona.attentionItems[0]) => {
    setModal({ type, itemId: item.id, client: item.client, job: item.job, summary: item.summary, detail: item.detail, amount: item.amount, status: item.state });
  };

  const closeModal = () => setModal(null);

  const handleAction = (action: string, item: typeof currentPersona.attentionItems[0]) => {
    switch (action) {
      case 'Review Quote': openModal('review_quote', item); break;
      case 'Resolve': openModal('resolve', item); break;
      case 'Review Issue': openModal('review_issue', item); break;
      case 'View': openModal('view', item); break;
      default: router.push(`/dashboard/jobs/${item.id}`);
    }
  };

  const handleResolved = () => {
    if (modal) setResolvedIds(prev => new Set([...prev, modal.itemId]));
    closeModal();
  };

  const handleRetried = () => {
    if (modal) setRetriedIds(prev => new Set([...prev, modal.itemId]));
    closeModal();
  };

  const handleApproved = () => {
    if (modal) setApprovedIds(prev => new Set([...prev, modal.itemId]));
    closeModal();
    setShowAlert(true);
  };

  const getEffectiveStatus = (item: typeof currentPersona.attentionItems[0]): StatusType => {
    if (approvedIds.has(item.id)) return 'sent';
    if (resolvedIds.has(item.id)) return 'REASONING';
    if (retriedIds.has(item.id)) return 'REASONING';
    return item.state as StatusType;
  };

  const getActionLabel = (item: typeof currentPersona.attentionItems[0]): string => {
    if (approvedIds.has(item.id)) return 'View';
    if (resolvedIds.has(item.id)) return 'View';
    if (retriedIds.has(item.id)) return 'View';
    return item.action;
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 max-w-[1400px]">

      {/* Alert banner */}
      {showAlert && (
        <AlertBanner
          variant="success"
          message="Quote has been sent to the client."
          dismissible
        />
      )}

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {currentPersona.kpis.map((kpi) => {
          const filterMap: Record<string, string> = {
            'Active Jobs': 'active',
            'Needs Your Input': 'NEEDS_SME_INPUT',
            'Awaiting Approval': 'AWAITING_HUMAN_APPROVAL',
            'In Progress': 'active',
            'Completed': 'EXECUTED',
            'Failed': 'FAILED_RETRY',
          };
          const filterValue = filterMap[kpi.label] ?? 'all';
          return (
            <Link key={kpi.label} href={`/dashboard/jobs?filter=${filterValue}`} className="block h-full">
              <MetricCard {...kpi} />
            </Link>
          );
        })}
      </div>

      {/* ── Attention queue + chart ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">

        {/* Attention queue */}
        <Card className="xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-[#E7E7E3]">
            <div>
              <h2 className="text-[15px] font-semibold text-[#171817]">Needs your attention</h2>
              <p className="text-xs text-[#6F716E] mt-0.5">{currentPersona.attentionItems.length} items require action</p>
            </div>
            <Link
              href="/dashboard/jobs"
              className="text-xs font-semibold text-[#19D66B] hover:text-[#079A4F] transition-colors flex items-center gap-1"
            >
              View all <Icon name="ArrowRightIcon" size={12} />
            </Link>
          </div>

          <div className="divide-y divide-[#E7E7E3]">
            {currentPersona.attentionItems.map((item) => {
              const effectiveStatus = getEffectiveStatus(item);
              const actionLabel = getActionLabel(item);
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-3 items-center px-4 sm:px-5 py-3.5 sm:py-4 hover:bg-[#FAFAF9] transition-colors group"
                >
                  {/* Avatar — fixed col */}
                  <div className="col-span-1 flex items-center justify-start">
                    <div className="w-9 h-9 rounded-[12px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
                      <span className="text-[#079A4F] font-bold text-xs">
                        {item.client.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                  </div>

                  {/* Info — flexible col */}
                  <div className="col-span-4 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-semibold text-[#171817] truncate">{item.client}</span>
                      <span className="text-[11px] text-[#6F716E]">·</span>
                      <span className="text-[12px] text-[#6F716E] truncate">{item.job}</span>
                    </div>
                    <p className="text-[12px] text-[#6F716E] mt-0.5 truncate">{item.summary} · {item.detail}</p>
                    {/* Mobile: status + amount inline */}
                    <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                      <StatusBadge status={effectiveStatus} size="sm" />
                      <span className="text-[12px] font-semibold text-[#171817]">{formatNGN(item.amount)}</span>
                    </div>
                  </div>

                  {/* Status + amount — fixed col, desktop only */}
                  <div className="hidden sm:flex col-span-3 flex-col items-start gap-1">
                    <StatusBadge status={effectiveStatus} size="sm" />
                    <span className="text-[12px] font-semibold text-[#171817]">{formatNGN(item.amount)}</span>
                  </div>

                  {/* Action — fixed col: always left-aligned at same x-position */}
                  <div className="col-span-3 flex items-center justify-start">
                    <button
                      onClick={() => handleAction(actionLabel, item)}
                      className="px-3 py-1.5 bg-[#F0F0EE] hover:bg-[#DDFBEA] text-[#171817] hover:text-[#079A4F] text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
                    >
                      {actionLabel}
                    </button>
                  </div>

                  {/* Timestamp — fixed col, right-aligned */}
                  <div className="hidden md:flex col-span-1 items-center justify-end">
                    <span className="text-[11px] text-[#999C98] whitespace-nowrap">{item.lastActivity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Chart */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[#171817]">Quote activity</h2>
              <p className="text-xs text-[#6F716E] mt-0.5">Last 7 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#6F716E]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#19D66B] inline-block" />Quotes</span>
              <span className="hidden sm:flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E7E7E3] inline-block" />Jobs</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#19D66B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#19D66B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6F716E" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#6F716E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E7E3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999C98' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#999C98' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E7E7E3', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                cursor={{ stroke: '#E7E7E3', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="jobs" stroke="#C8C9C7" strokeWidth={1.5} fill="url(#colorJobs)" dot={false} />
              <Area type="monotone" dataKey="quotes" stroke="#19D66B" strokeWidth={2} fill="url(#colorQuotes)" dot={false} activeDot={{ r: 4, fill: '#19D66B', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Recent jobs ── */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-[#E7E7E3]">
          <h2 className="text-[15px] font-semibold text-[#171817]">Recent jobs</h2>
          <Link
            href="/dashboard/jobs"
            className="text-xs font-semibold text-[#19D66B] hover:text-[#079A4F] transition-colors flex items-center gap-1"
          >
            View all <Icon name="ArrowRightIcon" size={12} />
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-[#E7E7E3] bg-[#FAFAF9]">
            {[
              { label: 'Client', span: 'col-span-3' },
              { label: 'Job', span: 'col-span-3' },
              { label: 'Status', span: 'col-span-2' },
              { label: 'Amount', span: 'col-span-2 text-right' },
              { label: 'Action', span: 'col-span-1 text-right' },
              { label: 'Updated', span: 'col-span-1 text-right' },
            ].map((h) => (
              <span key={h.label} className={`text-[11px] font-semibold text-[#999C98] uppercase tracking-wider ${h.span}`}>
                {h.label}
              </span>
            ))}
          </div>

          <div className="divide-y divide-[#E7E7E3]">
            {currentPersona.recentJobs.map((job) => (
              <div key={job.id} className="grid grid-cols-12 gap-4 items-center px-5 py-3.5 hover:bg-[#FAFAF9] transition-colors group">
                <div className="col-span-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[10px] bg-[#F0F0EE] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#6F716E]">
                      {job.client.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <span className="text-[13px] font-medium text-[#171817] truncate">{job.client}</span>
                </div>
                <span className="col-span-3 text-[13px] text-[#6F716E] truncate">{job.job}</span>
                <div className="col-span-2"><StatusBadge status={job.state as StatusType} size="sm" /></div>
                <span className="col-span-2 text-[13px] font-semibold text-[#171817] text-right">{formatNGN(job.amount)}</span>
                {/* Action — fixed col (before timestamp) */}
                <div className="col-span-1 flex justify-end">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#F0F0EE] text-[#6F716E] hover:text-[#171817] transition-all"
                  >
                    <Icon name="EllipsisHorizontalIcon" size={16} />
                  </Link>
                </div>
                {/* Updated — fixed col (after action) */}
                <span className="col-span-1 text-[12px] text-[#999C98] text-right">{job.updated}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile card stack */}
        <div className="sm:hidden divide-y divide-[#E7E7E3]">
          {currentPersona.recentJobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#FAFAF9] transition-colors"
            >
              <div className="w-9 h-9 rounded-[12px] bg-[#F0F0EE] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-[#6F716E]">
                  {job.client.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-[#171817] truncate">{job.client}</span>
                  <span className="text-[13px] font-semibold text-[#171817] shrink-0">{formatNGN(job.amount)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-[12px] text-[#6F716E] truncate">{job.job}</span>
                  <StatusBadge status={job.state as StatusType} size="sm" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* ── Modals ── */}
      {modal?.type === 'review_quote' && (
        <ReviewQuoteModal
          client={modal.client}
          job={modal.job}
          amount={modal.amount}
          onClose={closeModal}
          onApprove={() => { closeModal(); setModal({ ...modal, type: 'approve' }); }}
          onEdit={() => { closeModal(); setModal({ ...modal, type: 'edit_quote' }); }}
        />
      )}

      {modal?.type === 'edit_quote' && (
        <QuoteEditor
          clientName={modal.client}
          eventName={modal.job}
          onClose={closeModal}
          onSave={() => { closeModal(); }}
        />
      )}

      {modal?.type === 'edit_job' && (
        <JobEditor
          onClose={closeModal}
          onSave={() => closeModal()}
          initialData={{ client: modal?.client, eventType: modal?.job }}
        />
      )}

      {modal?.type === 'resolve' && (
        <ResolveModal
          client={modal.client}
          job={modal.job}
          missingInfo={modal.detail}
          onClose={closeModal}
          onResolved={handleResolved}
        />
      )}

      {modal?.type === 'review_issue' && (
        <ReviewIssueModal
          client={modal.client}
          job={modal.job}
          onClose={closeModal}
          onRetry={handleRetried}
          onAdjust={() => { closeModal(); setModal({ ...modal, type: 'edit_job' }); }}
        />
      )}

      {modal?.type === 'view' && (
        <ViewJobModal
          client={modal.client}
          job={modal.job}
          summary={modal.summary}
          detail={modal.detail}
          amount={modal.amount}
          status={modal.status as JobState}
          onClose={closeModal}
          onNavigate={() => { closeModal(); router.push(`/dashboard/jobs/${modal.itemId}`); }}
        />
      )}

      {modal?.type === 'approve' && (
        <ApprovalModal
          jobId={modal.itemId}
          clientName={modal.client}
          eventName={modal.job}
          total={modal.amount}
          onConfirm={handleApproved}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
