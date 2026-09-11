'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getAvailabilityDates, createAvailabilityDate, updateAvailabilityDate, deleteAvailabilityDate } from '@/lib/api';
import { usePersona } from '@/app/dashboard/context/PersonaContext';

// ── V2 Data Model ──────────────────────────────────────────────────────────────
// Maps to future: GET /business/availability/dates
// POST /business/availability/dates
// DELETE /business/availability/dates/:date

type DateStatus = 'UNAVAILABLE' | 'BOOKED';

interface AvailabilityDate {
  availabilityDateId: string;
  businessId: string;
  date: string; // "YYYY-MM-DD"
  status: DateStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

// Page-level load state — UNKNOWN must never render as AVAILABLE
type LoadState = 'loading' | 'loaded' | 'error';

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_DATES: AvailabilityDate[] = [
  {
    availabilityDateId: 'avd-01',
    businessId: 'biz-001',
    date: '2026-09-15',
    status: 'BOOKED',
    reason: 'Wedding booking',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    availabilityDateId: 'avd-02',
    businessId: 'biz-001',
    date: '2026-09-22',
    status: 'UNAVAILABLE',
    reason: 'Personal commitment',
    createdAt: '2026-08-05T14:00:00Z',
    updatedAt: '2026-08-05T14:00:00Z',
  },
  {
    availabilityDateId: 'avd-03',
    businessId: 'biz-001',
    date: '2026-10-03',
    status: 'BOOKED',
    reason: 'Corporate event — Zenith Bank',
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-10T09:00:00Z',
  },
  {
    availabilityDateId: 'avd-04',
    businessId: 'biz-001',
    date: '2026-10-10',
    status: 'UNAVAILABLE',
    reason: 'Equipment maintenance',
    createdAt: '2026-08-12T11:00:00Z',
    updatedAt: '2026-08-12T11:00:00Z',
  },
];

const REASON_OPTIONS = [
  { value: 'Client booking', label: 'Client booking' },
  { value: 'Personal commitment', label: 'Personal commitment' },
  { value: 'Other', label: 'Other' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDateDisplay(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatDateShort(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Shared card ────────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white border border-[#E7E7E3] rounded-[20px] ${className}`}
    style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
  >
    {children}
  </div>
);

// ── Date status badge ──────────────────────────────────────────────────────────
function DateStatusBadge({ status }: { status: DateStatus }) {
  if (status === 'BOOKED') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
        Booked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
      Unavailable
    </span>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────────────
function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-[#F0F0EE] rounded-xl animate-pulse ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Status card skeleton */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="w-9 h-9 rounded-[12px]" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3.5 w-40" />
            <SkeletonBlock className="h-3 w-56" />
          </div>
          <SkeletonBlock className="h-5 w-16 rounded-full" />
        </div>
      </Card>

      {/* Calendar skeleton */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBlock className="h-4 w-32" />
          <div className="flex gap-2">
            <SkeletonBlock className="w-7 h-7 rounded-lg" />
            <SkeletonBlock className="w-7 h-7 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_HEADERS.map((d) => (
            <SkeletonBlock key={d} className="h-3 mx-auto w-6" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-8 rounded-lg" />
          ))}
        </div>
      </Card>

      {/* List skeleton */}
      <Card>
        <div className="px-5 py-4 border-b border-[#E7E7E3]">
          <SkeletonBlock className="h-4 w-36" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#E7E7E3] last:border-0">
            <SkeletonBlock className="w-9 h-9 rounded-[12px]" />
            <div className="flex-1 space-y-1.5">
              <SkeletonBlock className="h-3.5 w-28" />
              <SkeletonBlock className="h-3 w-44" />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="p-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <Icon name="ExclamationTriangleIcon" size={22} className="text-red-500" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#171817] mb-1">Couldn't load availability</h3>
      <p className="text-[13px] text-[#6F716E] max-w-xs mx-auto leading-relaxed mb-5">
        Your availability couldn't be confirmed right now. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E7E3] text-[13px] font-semibold text-[#171817] rounded-xl hover:bg-[#F0F0EE] transition-colors"
      >
        <Icon name="ArrowPathIcon" size={14} />
        Retry
      </button>
    </Card>
  );
}

// ── Block Date Modal ───────────────────────────────────────────────────────────
interface BlockDateModalProps {
  onClose: () => void;
  onBlock: (date: string, status: DateStatus, reason?: string) => void;
}

function BlockDateModal({ onClose, onBlock }: BlockDateModalProps) {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<DateStatus>('UNAVAILABLE');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const isOther = reason === 'Other';
  const finalReason = isOther ? customReason.trim() : reason;
  const canSubmit = date.length > 0;

  const handleSubmit = () => {
    if (!date) {
      setError('Please select a date.');
      return;
    }
    setError('');
    onBlock(date, status, finalReason || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(20,25,20,0.16)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E3]">
          <div>
            <h3 className="text-[15px] font-bold text-[#171817]">Block a date</h3>
            <p className="text-[12px] text-[#6F716E] mt-0.5">
              BillAm will avoid taking enquiries for this date.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E]"
          >
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#171817]">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setError(''); }}
              className="w-full px-3 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] outline-none focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all"
            />
            {error && <p className="text-[11px] text-red-500">{error}</p>}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#171817]">Status</label>
            <div className="flex gap-2">
              {(['UNAVAILABLE', 'BOOKED'] as DateStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-semibold border transition-all ${
                    status === s
                      ? s === 'BOOKED' ?'bg-amber-50 border-amber-300 text-amber-700' :'bg-red-50 border-red-300 text-red-600' :'bg-white border-[#E7E7E3] text-[#6F716E] hover:bg-[#F0F0EE]'
                  }`}
                >
                  {s === 'BOOKED' ? 'Booked' : 'Unavailable'}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#171817]">
              Reason <span className="text-[#999C98] font-normal">(optional)</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] outline-none focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all appearance-none"
            >
              <option value="">Select a reason…</option>
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {isOther && (
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe the reason…"
                className="w-full px-3 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] placeholder:text-[#999C98] outline-none focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-[#E7E7E3]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold text-[#6F716E] bg-white border border-[#E7E7E3] rounded-xl hover:bg-[#F0F0EE] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-[#19D66B] rounded-xl hover:bg-[#079A4F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ boxShadow: canSubmit ? '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' : undefined }}
          >
            Block date
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Date Detail Panel ──────────────────────────────────────────────────────────
interface DateDetailProps {
  entry: AvailabilityDate;
  onRemove: (id: string) => void;
  onClose: () => void;
}

function DateDetailPanel({ entry, onRemove, onClose }: DateDetailProps) {
  return (
    <div className="mt-3 p-4 bg-[#FAFAF9] border border-[#E7E7E3] rounded-[16px]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#171817]">{formatDateDisplay(entry.date)}</p>
          <div className="mt-1">
            <DateStatusBadge status={entry.status} />
          </div>
          {entry.reason && (
            <p className="text-[12px] text-[#6F716E] mt-1.5">{entry.reason}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#999C98] hover:bg-[#F0F0EE] transition-colors shrink-0"
        >
          <Icon name="XMarkIcon" size={14} />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E7E7E3]">
        <button
          onClick={() => { onRemove(entry.availabilityDateId); onClose(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
        >
          <Icon name="TrashIcon" size={13} />
          Remove block
        </button>
      </div>
    </div>
  );
}

// ── Compact Calendar ───────────────────────────────────────────────────────────
interface CalendarProps {
  year: number;
  month: number; // 0-indexed
  blockedDates: AvailabilityDate[];
  selectedDate: string | null;
  onSelectDate: (dateStr: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

function CompactCalendar({
  year, month, blockedDates, selectedDate, onSelectDate, onPrev, onNext, onToday,
}: CalendarProps) {
  // Build a map for O(1) lookup
  const blockedMap = new Map<string, AvailabilityDate>();
  blockedDates.forEach((bd) => blockedMap.set(bd.date, bd));

  // First day of month (0=Sun, 1=Mon…)
  const firstDow = new Date(year, month, 1).getDay();
  // Convert to Mon-based (0=Mon … 6=Sun)
  const startOffset = (firstDow + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Today string
  const todayStr = (() => {
    const t = new Date();
    return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
  })();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6F716E] hover:bg-[#F0F0EE] transition-colors"
            aria-label="Previous month"
          >
            <Icon name="ChevronLeftIcon" size={14} />
          </button>
          <span className="text-[14px] font-bold text-[#171817] min-w-[130px] text-center">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            onClick={onNext}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6F716E] hover:bg-[#F0F0EE] transition-colors"
            aria-label="Next month"
          >
            <Icon name="ChevronRightIcon" size={14} />
          </button>
        </div>
        <button
          onClick={onToday}
          className="text-[11px] font-semibold text-[#6F716E] px-2.5 py-1 rounded-lg border border-[#E7E7E3] hover:bg-[#F0F0EE] transition-colors"
        >
          Today
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-[#999C98] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="h-9" />;
          }

          const dateStr = toDateStr(year, month, day);
          const blocked = blockedMap.get(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;

          let cellClass = 'relative flex items-center justify-center h-9 w-full rounded-lg text-[13px] font-medium transition-all cursor-pointer select-none ';

          if (isSelected) {
            cellClass += 'bg-[#19D66B] text-white font-bold shadow-sm ';
          } else if (blocked?.status === 'BOOKED') {
            cellClass += 'bg-amber-50 text-amber-700 font-semibold ';
          } else if (blocked?.status === 'UNAVAILABLE') {
            cellClass += 'bg-red-50 text-red-600 font-semibold ';
          } else {
            cellClass += 'text-[#171817] hover:bg-[#F0F0EE] ';
          }

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cellClass}
              title={blocked ? `${blocked.status}${blocked.reason ? ` — ${blocked.reason}` : ''}` : undefined}
            >
              {isToday && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#19D66B]" />
              )}
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#E7E7E3] flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#19D66B]" />
          <span className="text-[11px] text-[#6F716E]">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300" />
          <span className="text-[11px] text-[#6F716E]">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-50 border border-red-200" />
          <span className="text-[11px] text-[#6F716E]">Unavailable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#19D66B]" />
          <span className="text-[11px] text-[#6F716E]">Today</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AvailabilityPage() {
  const { currentPersona } = usePersona();
  const businessId = `biz-${currentPersona.key.replace('_', '-')}`;

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [dates, setDates] = useState<AvailabilityDate[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Calendar navigation
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const loadDates = async () => {
    setLoadState('loading');
    try {
      const data = await getAvailabilityDates(businessId);
      setDates(data.map(d => ({
        availabilityDateId: d.id,
        businessId: d.business_id,
        date: d.date,
        status: d.status === 'booked' ? 'BOOKED' : 'UNAVAILABLE',
        reason: d.reason,
        createdAt: d.created_at,
        updatedAt: d.created_at,
      })));
      setLoadState('loaded');
    } catch (err) {
      console.error(err);
      setLoadState('error');
    }
  };

  useEffect(() => {
    loadDates();
  }, [businessId]);

  const handleRetry = () => {
    loadDates();
  };

  const handlePrevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const handleToday = () => {
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  };

  const handleBlock = async (date: string, status: DateStatus, reason?: string) => {
    try {
      const existing = dates.find((d) => d.date === date);
      const apiStatus = status === 'BOOKED' ? 'booked' : 'blocked';
      
      if (existing) {
        // Update existing
        await updateAvailabilityDate(existing.availabilityDateId, {
          status: apiStatus,
          reason,
        });
        setDates((prev) =>
          prev.map((d) =>
            d.date === date
              ? { ...d, status, reason, updatedAt: new Date().toISOString() }
              : d
          )
        );
      } else {
        const newApiEntry = await createAvailabilityDate({
          business_id: businessId,
          date,
          status: apiStatus,
          reason,
        });
        const newEntry: AvailabilityDate = {
          availabilityDateId: newApiEntry.id,
          businessId: newApiEntry.business_id,
          date: newApiEntry.date,
          status: newApiEntry.status === 'booked' ? 'BOOKED' : 'UNAVAILABLE',
          reason: newApiEntry.reason,
          createdAt: newApiEntry.created_at,
          updatedAt: newApiEntry.created_at,
        };
        setDates((prev) => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
      }
      // Navigate calendar to the blocked month
      const [y, m] = date.split('-').map(Number);
      setCalYear(y);
      setCalMonth(m - 1);
      setSelectedDate(date);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteAvailabilityDate(id);
      setDates((prev) => prev.filter((d) => d.availabilityDateId !== id));
      setSelectedDate(null);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedEntry = selectedDate ? dates.find((d) => d.date === selectedDate) : null;

  // Sort dates ascending
  const sortedDates = [...dates].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <div className="space-y-4">
        {/* ── Page header ── */}
        <div>
          <h2 className="text-[18px] font-bold text-[#171817]">Availability</h2>
          <p className="text-[12px] text-[#6F716E] mt-0.5">
            Tell BillAm when you're available so it can avoid taking enquiries for dates you've already committed to.
          </p>
        </div>

        {/* ── Status card ── */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
              <Icon name="CalendarDaysIcon" size={18} className="text-[#19D66B]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#171817]">Availability checking</p>
              <p className="text-[12px] text-[#6F716E] mt-0.5">
                BillAm checks your availability when a client provides an event date.
              </p>
            </div>
            {loadState === 'loaded' ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#DDFBEA] text-[#079A4F] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19D66B]" />
                Active
              </span>
            ) : loadState === 'error' ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Error
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F0F0EE] text-[#6F716E] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#999C98] animate-pulse" />
                Loading…
              </span>
            )}
          </div>
        </Card>

        {/* ── Loading state ── */}
        {loadState === 'loading' && <LoadingSkeleton />}

        {/* ── Error state ── */}
        {loadState === 'error' && <ErrorState onRetry={handleRetry} />}

        {/* ── Loaded content ── */}
        {loadState === 'loaded' && (
          <>
            {/* Calendar card */}
            <Card className="p-5">
              <CompactCalendar
                year={calYear}
                month={calMonth}
                blockedDates={dates}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                onToday={handleToday}
              />

              {/* Selected date detail */}
              {selectedDate && selectedEntry && (
                <DateDetailPanel
                  entry={selectedEntry}
                  onRemove={handleRemove}
                  onClose={() => setSelectedDate(null)}
                />
              )}

              {/* Selected available date info */}
              {selectedDate && !selectedEntry && (
                <div className="mt-3 p-4 bg-[#F0FFF6] border border-[#19D66B]/20 rounded-[16px] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[#171817]">{formatDateDisplay(selectedDate)}</p>
                    <p className="text-[12px] text-[#6F716E] mt-0.5">Available — no blocks on this date.</p>
                  </div>
                  <button
                    onClick={() => { setShowModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#19D66B] bg-white border border-[#19D66B]/30 rounded-xl hover:bg-[#DDFBEA] transition-colors shrink-0"
                  >
                    <Icon name="PlusIcon" size={13} />
                    Block
                  </button>
                </div>
              )}
            </Card>

            {/* Unavailable dates list */}
            <Card>
              <div className="px-5 py-4 border-b border-[#E7E7E3] flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[14px] font-semibold text-[#171817]">Unavailable dates</h3>
                  <p className="text-[12px] text-[#6F716E] mt-0.5">
                    {sortedDates.length === 0
                      ? 'No blocked dates'
                      : `${sortedDates.length} date${sortedDates.length !== 1 ? 's' : ''} blocked`}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#19D66B] bg-[#F0FFF6] border border-[#19D66B]/20 rounded-xl hover:bg-[#DDFBEA] transition-colors shrink-0"
                >
                  <Icon name="PlusIcon" size={14} />
                  Block a date
                </button>
              </div>

              {/* Empty state */}
              {sortedDates.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0F0EE] flex items-center justify-center mx-auto mb-3">
                    <Icon name="CalendarDaysIcon" size={22} className="text-[#999C98]" />
                  </div>
                  <p className="text-[13px] font-semibold text-[#171817]">You're currently showing as available.</p>
                  <p className="text-[12px] text-[#6F716E] mt-1 max-w-xs mx-auto">
                    Add dates you're already booked or unavailable so BillAm can avoid conflicts.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#19D66B] text-white text-[13px] font-semibold rounded-xl hover:bg-[#079A4F] transition-colors mx-auto"
                    style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
                  >
                    <Icon name="PlusIcon" size={14} />
                    Block a date
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#E7E7E3]">
                  {sortedDates.map((bd) => (
                    <div
                      key={bd.availabilityDateId}
                      className={`flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAF9] transition-colors group cursor-pointer ${
                        selectedDate === bd.date ? 'bg-[#FAFAF9]' : ''
                      }`}
                      onClick={() => handleSelectDate(bd.date)}
                    >
                      {/* Date icon */}
                      <div
                        className={`w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 ${
                          bd.status === 'BOOKED' ? 'bg-amber-50' : 'bg-red-50'
                        }`}
                      >
                        <Icon
                          name="CalendarDaysIcon"
                          size={16}
                          className={bd.status === 'BOOKED' ? 'text-amber-500' : 'text-red-400'}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-semibold text-[#171817]">
                            {formatDateShort(bd.date)}
                          </span>
                          <DateStatusBadge status={bd.status} />
                        </div>
                        {bd.reason && (
                          <p className="text-[12px] text-[#6F716E] mt-0.5 truncate">{bd.reason}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemove(bd.availabilityDateId); }}
                          className="p-1.5 rounded-lg text-[#999C98] hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Remove block"
                        >
                          <Icon name="TrashIcon" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Info callout */}
            <div className="flex items-start gap-3 px-4 py-3.5 bg-[#F0FFF6] border border-[#19D66B]/20 rounded-[16px]">
              <Icon name="InformationCircleIcon" size={16} className="text-[#19D66B] shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-semibold text-[#079A4F]">How availability checking works</p>
                <p className="text-[12px] text-[#6F716E] mt-0.5">
                  When a client provides an event date, BillAm checks if it matches a blocked date.
                  A match returns <strong>CONFLICT</strong>. If the check can't be completed, the result is{' '}
                  <strong>UNKNOWN</strong> — never treated as available.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Block Date Modal */}
      {showModal && (
        <BlockDateModal
          onClose={() => setShowModal(false)}
          onBlock={handleBlock}
        />
      )}
    </>
  );
}
