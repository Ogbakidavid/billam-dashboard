'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import StatusBadge, { StatusType } from '@/app/dashboard/components/StatusBadge';
import ChatPanel from './ChatPanel';
import { getJob } from '@/lib/api';
import { Job } from '@/app/dashboard/types';
import BriefPanel from './BriefPanel';
import QuoteCard from './QuoteCard';
import ApprovalModal from './ApprovalModal';
import QuoteEditor from '@/app/dashboard/components/QuoteEditor';
import JobEditor from '@/app/dashboard/components/JobEditor';
import { ResolveModal, ReviewIssueModal } from '@/app/dashboard/components/WorkflowModals';
import { usePersona } from '@/app/dashboard/context/PersonaContext';
import { JobState, AuditEvent } from '@/app/dashboard/types';
import { formatTime } from '@/lib/currency';

type TabType = 'chat' | 'brief' | 'quote' | 'activity' | 'notes' | 'files';

const activityLog: AuditEvent[] = [
  { id: 'ae-1', type: 'client', label: 'Client message received', timestamp: '2026-09-01T10:30:00Z' },
  { id: 'ae-2', type: 'agent', label: 'Brief extraction started', timestamp: '2026-09-01T10:31:00Z' },
  { id: 'ae-3', type: 'agent', label: '7 fields extracted from conversation', timestamp: '2026-09-01T10:31:10Z' },
  { id: 'ae-4', type: 'agent', label: 'Clarification question generated', timestamp: '2026-09-01T10:31:20Z' },
  { id: 'ae-5', type: 'agent', label: 'Clarification sent to client', timestamp: '2026-09-01T10:31:30Z' },
  { id: 'ae-6', type: 'client', label: 'Client responded with budget range', timestamp: '2026-09-01T10:32:00Z' },
  { id: 'ae-7', type: 'agent', label: 'Brief fully populated', timestamp: '2026-09-01T10:35:00Z' },
  { id: 'ae-8', type: 'agent', label: 'Draft quote generated', timestamp: '2026-09-01T10:35:10Z' },
  { id: 'ae-9', type: 'sme', label: 'Awaiting SME approval', timestamp: '2026-09-01T10:35:30Z' },
];

const typeColor: Record<string, string> = {
  client: 'bg-blue-50 text-blue-600',
  agent: 'bg-[#DDFBEA] text-[#079A4F]',
  sme: 'bg-amber-50 text-amber-600',
  system: 'bg-[#F0F0EE] text-[#6F716E]',
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { currentPersona } = usePersona();

  const [realJob, setRealJob] = useState<Job | null>(null);

  useEffect(() => {
    let cancelled = false;
    getJob(id)
      .then((j) => { if (!cancelled) setRealJob(j); })
      .catch((err) => console.error('Failed to load job:', err));
    return () => { cancelled = true; };
  }, [id]);

  const personaJob = currentPersona.allJobs.find(j => j.id === id) || currentPersona.allJobs[0];
  const job = {
    client: personaJob?.client || 'Adaeze Okonkwo',
    job: personaJob?.job || 'Wedding Decoration',
    status: (personaJob?.state || 'AWAITING_HUMAN_APPROVAL') as JobState,
    jobId: `JOB-250901-${id?.slice(-4) || '0001'}`,
    created: '01 Sep 2026 10:30 AM',
    location: personaJob?.job?.includes('Lekki') ? 'Lekki' : 'Victoria Island',
    service: personaJob?.service || 'Full Venue Decoration',
  };

  const [activeTab, setActiveTab] = useState<TabType>('quote');
  const [showApproval, setShowApproval] = useState(false);
  const [showQuoteEditor, setShowQuoteEditor] = useState(false);
  const [showJobEditor, setShowJobEditor] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [showReviewIssue, setShowReviewIssue] = useState(false);
  const [approved, setApproved] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [retried, setRetried] = useState(false);
  const [savedQuoteTotal, setSavedQuoteTotal] = useState<number | null>(null);
  const [savedJobData, setSavedJobData] = useState<{ client?: string; eventType?: string } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [extraActivity, setExtraActivity] = useState<AuditEvent[]>([]);

  const handleSmeMessage = (event: AuditEvent) => {
    setExtraActivity(prev => [...prev, event]);
  };

  const allActivity = [...activityLog, ...extraActivity];

  const handleApprove = () => {
    setShowApproval(false);
    setApproved(true);
  };

  const handleQuoteSave = (total: number) => {
    setSavedQuoteTotal(total);
    setShowQuoteEditor(false);
  };

  const handleJobSave = (data: { client?: string; eventType?: string }) => {
    setSavedJobData(data);
    setShowJobEditor(false);
  };

  const effectiveStatus: JobState = approved ? 'EXECUTED' : resolved ? 'REASONING' : retried ? 'REASONING' : job.status as JobState;
  const displayClient = savedJobData?.client || job.client;
  const displayJob = savedJobData?.eventType || job.job;

  // Desktop bottom tabs (quote/activity/notes/files)
  const bottomTabs: { key: TabType; label: string }[] = [
    { key: 'quote', label: 'Quote' },
    { key: 'activity', label: 'Activity' },
    { key: 'notes', label: 'Notes' },
    { key: 'files', label: 'Files' },
  ];

  // Mobile tabs (all sections)
  const mobileTabs: { key: TabType; label: string }[] = [
    { key: 'chat', label: 'Chat' },
    { key: 'brief', label: 'Brief' },
    { key: 'quote', label: 'Quote' },
    { key: 'activity', label: 'Activity' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-[1400px]">
      {/* ── Header ── */}
      <div
        className="bg-white border border-[#E7E7E3] rounded-[20px] px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/jobs"
            className="p-1.5 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E] hover:text-[#171817] shrink-0"
          >
            <Icon name="ArrowLeftIcon" size={16} />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[16px] sm:text-[17px] font-bold text-[#171817]">{displayClient}</h1>
              <StatusBadge status={effectiveStatus} />
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[12px] text-[#6F716E]">{displayJob}</span>
              <span className="text-[#E7E7E3] hidden sm:inline">·</span>
              <span className="text-[12px] text-[#999C98] hidden sm:inline">Job ID: {job.jobId}</span>
              <span className="text-[#E7E7E3] hidden sm:inline">·</span>
              <span className="text-[12px] text-[#999C98] hidden sm:inline">Created: {job.created}</span>
            </div>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowJobEditor(true)}
            className="px-3 py-2 border border-[#E7E7E3] bg-white text-[#171817] text-[13px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors"
          >
            Edit Job
          </button>

          {!approved && effectiveStatus === 'AWAITING_HUMAN_APPROVAL' && (
            <button
              onClick={() => setShowApproval(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#19D66B] text-white text-[13px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors"
              style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
            >
              <Icon name="CheckCircleIcon" size={15} />
              Approve &amp; Send
            </button>
          )}

          {approved && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#DDFBEA] text-[#079A4F] text-[13px] font-bold rounded-xl">
              <Icon name="CheckCircleIcon" size={15} />
              Quote Sent
            </div>
          )}

          {(effectiveStatus === 'NEEDS_SME_INPUT' || effectiveStatus === 'CLARIFYING') && !approved && (
            <button
              onClick={() => setShowResolve(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-[13px] font-bold rounded-xl hover:bg-amber-600 transition-colors"
            >
              <Icon name="WrenchScrewdriverIcon" size={15} />
              Resolve
            </button>
          )}

          {effectiveStatus === 'FAILED_RETRY' && !approved && !retried && (
            <button
              onClick={() => setShowReviewIssue(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-[13px] font-bold rounded-xl hover:bg-red-600 transition-colors"
            >
              <Icon name="ExclamationTriangleIcon" size={15} />
              Review Issue
            </button>
          )}

          {retried && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-[13px] font-bold rounded-xl">
              <Icon name="ArrowPathIcon" size={15} />
              Retrying...
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP: chat + brief side by side ── */}
      <div className="hidden lg:grid grid-cols-2 gap-5" style={{ minHeight: '520px' }}>
        <div className="h-[520px]">
          <ChatPanel jobId={id} onSmeMessage={handleSmeMessage} />
        </div>
        <div className="overflow-y-auto max-h-[520px] pr-1">
          <BriefPanel
            extracted_fields={realJob?.extracted_fields}
            missing_fields={realJob?.missing_fields}
          />
        </div>
      </div>

      {/* ── MOBILE: tabbed sections ── */}
      <div className="lg:hidden">
        {/* Mobile tab bar */}
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide bg-white border border-[#E7E7E3] rounded-[16px] p-1 mb-4"
          style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
        >
          {mobileTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-2 text-[12px] font-semibold rounded-[12px] transition-all whitespace-nowrap ${activeTab === tab.key
                ? 'bg-[#19D66B] text-white'
                : 'text-[#6F716E] hover:text-[#171817]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile tab content */}
        {activeTab === 'chat' && (
          <div style={{ height: '480px' }}>
            <ChatPanel jobId={id} onSmeMessage={handleSmeMessage} />
          </div>
        )}
        {activeTab === 'brief' && (
          <BriefPanel
            extracted_fields={realJob?.extracted_fields}
            missing_fields={realJob?.missing_fields}
          />
        )}
        {activeTab === 'quote' && (
          <QuoteCard
            onApprove={() => setShowApproval(true)}
            onEditQuote={() => setShowQuoteEditor(true)}
            savedTotal={savedQuoteTotal}
            line_items={realJob?.quote?.line_items}
          />
        )}
        {activeTab === 'activity' && (
          <div
            className="bg-white border border-[#E7E7E3] rounded-[20px] p-4 space-y-3"
            style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
          >
            {allActivity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3">
                <span className="text-[11px] text-[#999C98] w-16 shrink-0 mt-0.5">{formatTime(entry.timestamp)}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#E7E7E3] shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${typeColor[entry.type]}`}>
                    {entry.type}
                  </span>
                  <p className="text-[13px] text-[#171817] mt-1">{entry.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'notes' && (
          <div
            className="bg-white border border-[#E7E7E3] rounded-[20px] p-4"
            style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
          >
            <textarea
              className="w-full bg-[#FAFAF9] border border-[#E7E7E3] rounded-xl px-4 py-3 text-[13px] text-[#171817] placeholder:text-[#999C98] outline-hidden focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 resize-none"
              rows={5}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add an internal note..."
            />
            {noteText && (
              <button
                onClick={() => setNoteText('')}
                className="mt-2 px-4 py-2 bg-[#19D66B] text-white text-[12px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors"
              >
                Save Note
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── DESKTOP: Bottom tabs (Quote / Activity / Notes / Files) ── */}
      <div
        className="hidden lg:block bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
      >
        <div className="flex items-center gap-0 px-5 pt-4 pb-0 border-b border-[#E7E7E3]">
          {bottomTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-[13px] font-medium transition-colors mr-1 ${activeTab === tab.key
                ? 'text-[#171817] font-semibold border-b-2 border-[#19D66B]'
                : 'text-[#6F716E] hover:text-[#171817] border-b-2 border-transparent'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'quote' && (
            <QuoteCard
              onApprove={() => setShowApproval(true)}
              onEditQuote={() => setShowQuoteEditor(true)}
              savedTotal={savedQuoteTotal}
              line_items={realJob?.quote?.line_items}
            />
          )}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              {allActivity.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className="text-[11px] text-[#999C98] w-20 shrink-0">{formatTime(entry.timestamp)}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E7E7E3] shrink-0" />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${typeColor[entry.type]}`}>
                    {entry.type}
                  </span>
                  <span className="text-[13px] text-[#171817]">{entry.label}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'notes' && (
            <div>
              <textarea
                className="w-full bg-[#FAFAF9] border border-[#E7E7E3] rounded-xl px-4 py-3 text-[13px] text-[#171817] placeholder:text-[#999C98] outline-hidden focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 resize-none"
                rows={4}
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add an internal note..."
              />
              {noteText && (
                <button
                  onClick={() => setNoteText('')}
                  className="mt-2 px-4 py-2 bg-[#19D66B] text-white text-[12px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors"
                >
                  Save Note
                </button>
              )}
            </div>
          )}
          {activeTab === 'files' && (
            <div className="text-center py-8 text-[#999C98] text-[13px]">No files attached to this job.</div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {showApproval && (
        <ApprovalModal onConfirm={handleApprove} onCancel={() => setShowApproval(false)} />
      )}
      {showQuoteEditor && (
        <QuoteEditor
          jobId={id}
          clientName={displayClient}
          eventName={displayJob}
          onClose={() => setShowQuoteEditor(false)}
          onSave={handleQuoteSave}
        />
      )}
      {showJobEditor && (
        <JobEditor
          onClose={() => setShowJobEditor(false)}
          onSave={handleJobSave}
          initialData={{ client: displayClient, eventType: displayJob }}
        />
      )}
      {showResolve && (
        <ResolveModal
          client={displayClient}
          job={displayJob}
          onClose={() => setShowResolve(false)}
          onResolved={() => { setResolved(true); setShowResolve(false); }}
        />
      )}
      {showReviewIssue && (
        <ReviewIssueModal
          client={displayClient}
          job={displayJob}
          onClose={() => setShowReviewIssue(false)}
          onRetry={() => { setRetried(true); setShowReviewIssue(false); }}
          onAdjust={() => { setShowReviewIssue(false); setShowJobEditor(true); }}
        />
      )}
    </div>
  );
}
