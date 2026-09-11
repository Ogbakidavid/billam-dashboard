'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StatusBadge, { StatusType } from '@/app/dashboard/components/StatusBadge';
import Icon from '@/components/ui/AppIcon';
import EmptyState from '@/app/dashboard/components/EmptyState';
import { usePersona } from '@/app/dashboard/context/PersonaContext';
import { JobState } from '@/app/dashboard/types';
import { formatNGN } from '@/lib/currency';

import { getJobs, ApiJob } from '@/lib/api';

const filters = [
  { label: 'All',               value: 'all' },
  { label: 'Active',            value: 'active' },
  { label: 'Needs Input',       value: 'NEEDS_SME_INPUT' },
  { label: 'Awaiting Approval', value: 'AWAITING_HUMAN_APPROVAL' },
  { label: 'Completed',         value: 'EXECUTED' },
  { label: 'Failed',            value: 'FAILED_RETRY' },
];

const activeStates: JobState[] = ['REASONING', 'CLARIFYING', 'NEEDS_SME_INPUT', 'AWAITING_HUMAN_APPROVAL'];

function JobsContent() {
  const { currentPersona } = usePersona();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [apiJobsList, setApiJobsList] = useState<any[]>([]);

  useEffect(() => {
    getJobs()
      .then((res) => {
        if (res && res.jobs && res.jobs.length > 0) {
          const mapped = res.jobs.map((j: ApiJob) => ({
            id: j.job_id,
            client: j.extracted_fields?.client_name || j.extracted_fields?.event_type || `Job ${j.job_id.slice(0, 6)}`,
            phone: j.extracted_fields?.client_phone || `+234 80${Math.floor(Math.random() * 90000000 + 10000000)}`,
            job: j.extracted_fields?.event_type || j.business_type,
            service: j.business_type,
            state: j.state as JobState,
            amount: j.quote ? j.quote.total : 0,
            lastActivity: 'Just now',
            updated: new Date(j.updated_at).toLocaleDateString(),
            rawDate: new Date(j.updated_at).getTime(),
          })).sort((a, b) => b.rawDate - a.rawDate);
          setApiJobsList(mapped);
        }
      })
      .catch(() => {
        // Fallback to local persona state
      });
  }, []);

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      const valid = filters.some((f) => f.value === filterParam);
      setActiveFilter(valid ? filterParam : 'all');
    } else {
      setActiveFilter('all');
    }
  }, [searchParams]);

  const allJobsSource = apiJobsList.length > 0 ? apiJobsList : currentPersona.allJobs;

  const filtered = allJobsSource.filter((job) => {
    const matchesSearch =
      !search ||
      job.client.toLowerCase().includes(search.toLowerCase()) ||
      job.job.toLowerCase().includes(search.toLowerCase()) ||
      job.service.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'active' && activeStates.includes(job.state as JobState)) ||
      job.state === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-[1400px]">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#171817]">Jobs</h1>
          <p className="text-[12px] text-[#6F716E] mt-0.5">{currentPersona.allJobs.length} total jobs · {currentPersona.label}</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#19D66B] text-white text-[13px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors"
          style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
        >
          <Icon name="PlusIcon" size={15} />
          <span className="hidden sm:inline">New Job</span>
        </button>
      </div>

      {/* Search + filters */}
      <div
        className="bg-white border border-[#E7E7E3] rounded-[20px] p-3 sm:p-4"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
      >
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999C98]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, clients, services..."
              className="w-full pl-9 pr-4 py-2 bg-[#F5F5F3] border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] placeholder:text-[#999C98] outline-hidden focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all"
            />
          </div>

          {/* Filter pills — scrollable on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === f.value
                    ? 'bg-[#19D66B] text-white'
                    : 'bg-[#F0F0EE] text-[#6F716E] hover:bg-[#E7E7E3] hover:text-[#171817]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div
        className="hidden sm:block bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
      >
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E7E7E3] bg-[#FAFAF9]">
          {[
            { label: 'Client',        span: 'col-span-3' },
            { label: 'Job',           span: 'col-span-3' },
            { label: 'Status',        span: 'col-span-2' },
            { label: 'Amount',        span: 'col-span-2 text-right' },
            { label: 'Action',        span: 'col-span-1 text-right' },
            { label: 'Updated',       span: 'col-span-1 text-right' },
          ].map((h) => (
            <span key={h.label} className={`text-[11px] font-semibold text-[#999C98] uppercase tracking-wider ${h.span}`}>
              {h.label}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="BriefcaseIcon"
            title="No Jobs Found"
            description="You don't have any jobs yet. Start a new conversation."
          />
        ) : (
          <div className="divide-y divide-[#E7E7E3]">
            {filtered.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="grid grid-cols-12 gap-4 items-center px-5 py-3.5 hover:bg-[#FAFAF9] transition-colors group cursor-pointer"
              >
                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-[10px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#079A4F]">
                      {job.client.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#171817] truncate">{job.client}</p>
                    <p className="text-[11px] text-[#999C98] truncate">{job.phone}</p>
                  </div>
                </div>
                <div className="col-span-3 min-w-0">
                  <p className="text-[13px] text-[#171817] truncate">{job.job}</p>
                  <p className="text-[11px] text-[#999C98] truncate">{job.service}</p>
                </div>
                <div className="col-span-2">
                  <StatusBadge status={job.state as StatusType} size="sm" />
                </div>
                <span className="col-span-2 text-[13px] font-semibold text-[#171817] text-right">{formatNGN(job.amount)}</span>
                {/* Action column — fixed, always present */}
                <div className="col-span-1 flex items-center justify-end">
                  <button className="p-1.5 rounded-lg hover:bg-[#F0F0EE] text-[#6F716E] hover:text-[#171817] transition-all opacity-0 group-hover:opacity-100">
                    <Icon name="EllipsisHorizontalIcon" size={15} />
                  </button>
                </div>
                {/* Updated/timestamp column — fixed, always present */}
                <span className="col-span-1 text-[11px] text-[#999C98] text-right">{job.updated}</span>
              </Link>
            ))}
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
              icon="BriefcaseIcon"
              title="No Jobs Found"
              description="You don't have any jobs yet. Start a new conversation."
            />
          </div>
        ) : (
          filtered.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="flex items-start gap-3 bg-white border border-[#E7E7E3] rounded-[16px] p-4 hover:bg-[#FAFAF9] transition-colors"
              style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
            >
              <div className="w-10 h-10 rounded-[12px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-[#079A4F]">
                  {job.client.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#171817] truncate">{job.client}</p>
                    <p className="text-[12px] text-[#6F716E] truncate">{job.job}</p>
                    <p className="text-[11px] text-[#999C98] truncate mt-0.5">{job.service}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[13px] font-bold text-[#171817]">{formatNGN(job.amount)}</span>
                    <StatusBadge status={job.state as StatusType} size="sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E7E7E3]">
                  <span className="text-[11px] text-[#999C98]">{job.phone}</span>
                  <span className="text-[11px] text-[#999C98]">{job.lastActivity}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#6F716E] text-sm">Loading jobs…</div>}>
      <JobsContent />
    </Suspense>
  );
}
