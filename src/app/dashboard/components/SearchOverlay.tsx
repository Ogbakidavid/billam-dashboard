'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

const searchData = [
  { type: 'Client', label: 'Sarah Adeyemi',              sub: 'Wedding Catering · Ikeja',          href: '/dashboard/jobs/ct-job-001' },
  { type: 'Client', label: 'Michael Okoro',              sub: 'Corporate Catering · Lekki',         href: '/dashboard/jobs/ct-job-002' },
  { type: 'Client', label: 'David James',                sub: 'Corporate Launch · Victoria Island', href: '/dashboard/jobs/ct-job-003' },
  { type: 'Job',    label: 'JOB-001 — Wedding Catering', sub: 'Awaiting Approval · ₦507,000',       href: '/dashboard/jobs/ct-job-001' },
  { type: 'Job',    label: 'JOB-002 — Corporate Catering', sub: 'Needs Input · ₦280,000',           href: '/dashboard/jobs/ct-job-002' },
  { type: 'Quote',  label: 'QT-001 — Sarah Adeyemi',     sub: 'Awaiting Approval · ₦507,000',       href: '/dashboard/quotes' },
  { type: 'Quote',  label: 'QT-002 — Amaka Nwosu',       sub: 'Draft · ₦195,000',                   href: '/dashboard/quotes' },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  Client: { bg: 'bg-blue-50',      text: 'text-blue-600' },
  Job:    { bg: 'bg-[#DDFBEA]',    text: 'text-[#079A4F]' },
  Quote:  { bg: 'bg-amber-50',     text: 'text-amber-600' },
};

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const filtered = query.length > 0
    ? searchData.filter(
        (d) =>
          d.label.toLowerCase().includes(query.toLowerCase()) ||
          d.sub.toLowerCase().includes(query.toLowerCase())
      )
    : searchData.slice(0, 5);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" onClick={onClose} />
      <div
        className="relative w-full max-w-lg bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden"
        style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.10)' }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E7E7E3]">
          <Icon name="MagnifyingGlassIcon" size={17} className="text-[#999C98] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered.length > 0) {
                handleSelect(filtered[0].href);
              }
            }}
            placeholder="Search clients, jobs, quotes..."
            className="flex-1 bg-transparent text-[14px] text-[#171817] placeholder:text-[#999C98] outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F0F0EE] transition-colors"
          >
            <Icon name="XMarkIcon" size={15} className="text-[#6F716E]" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-[#999C98]">No results found</div>
          ) : (
            filtered.map((item, i) => {
              const tc = typeColors[item.type] ?? { bg: 'bg-[#F0F0EE]', text: 'text-[#6F716E]' };
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAFAF9] transition-colors text-left"
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${tc.bg} ${tc.text}`}>
                    {item.type}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#171817] truncate">{item.label}</p>
                    <p className="text-[11px] text-[#999C98] truncate">{item.sub}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-[#E7E7E3] flex items-center gap-4 text-[11px] text-[#999C98]">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#F0F0EE] border border-[#E7E7E3] rounded text-[10px] font-mono">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#F0F0EE] border border-[#E7E7E3] rounded text-[10px] font-mono">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
