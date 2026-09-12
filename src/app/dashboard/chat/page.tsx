'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Message, QuoteStatus } from '@/app/dashboard/types';
import { formatTime } from '@/lib/currency';
import { createJob, postMessage, getJob as getJobById } from '@/lib/api';
import { usePersona } from '@/app/dashboard/context/PersonaContext';
import ClientQuoteCard from '@/app/dashboard/components/ClientQuoteCard';

// ── Persona metadata for the dropdown (display only) ─────────────────────────

interface ClientPersona {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  role: string;
  description: string;
  service: string;
}

const CLIENT_PERSONAS: ClientPersona[] = [
  {
    id: 'sarah',
    name: 'Sarah Adeyemi',
    avatar: 'SA',
    avatarColor: '#7C3AED',
    role: 'Bride-to-be',
    description: 'Detail-oriented, knows exactly what she wants.',
    service: 'Wedding Decoration',
  },
  {
    id: 'emeka',
    name: 'Emeka Okafor',
    avatar: 'EO',
    avatarColor: '#0891B2',
    role: 'Corporate Events Manager',
    description: 'Busy professional, gives minimal info upfront.',
    service: 'Corporate Event Decoration',
  },
  {
    id: 'funke',
    name: 'Funke Balogun',
    avatar: 'FB',
    avatarColor: '#D97706',
    role: 'High-Budget Client',
    description: 'Wants something extraordinary, budget is flexible.',
    service: 'Traditional Ceremony Decor',
  },
  {
    id: 'chidi',
    name: 'Chidi Nwosu',
    avatar: 'CN',
    avatarColor: '#DC2626',
    role: 'Last-Minute Requester',
    description: 'Urgent timeline, needs immediate availability.',
    service: 'Outdoor Event Decoration',
  },
];

// ── Business type map tied to the active persona ──────────────────────────────

const BUSINESS_TYPE_MAP: Record<string, string> = {
  event_decoration: 'event_vendor',
  photography: 'photographer',
  tailoring: 'tailor',
  catering: 'caterer',
  event_planning: 'event_planner',
  equipment_rental: 'equipment_rental',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatSimulatorPage() {
  const { currentPersona } = usePersona();

  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(CLIENT_PERSONAS[0].id);
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Live conversation state
  const [jobId, setJobId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const selectedPersona =
    CLIENT_PERSONAS.find((p) => p.id === selectedPersonaId) || CLIENT_PERSONAS[0];

  // Auto scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Restore active job from localStorage on mount
  useEffect(() => {
    const storedJobId = localStorage.getItem('billam_active_job_id');
    if (!storedJobId) return;
    setJobId(storedJobId);
    getJobById(storedJobId)
      .then((job) => {
        if (job) setMessages(extractMessages(job));
      })
      .catch(() => {
        // The backend may have been restarted/reseeded since this browser
        // session. Do not leave the simulator displaying a dead job ID after
        // the restore request returns 404; the next message will create a
        // fresh job normally.
        localStorage.removeItem('billam_active_job_id');
        setJobId(null);
        setMessages([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`;
    }
  }, [input]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const businessType = BUSINESS_TYPE_MAP[currentPersona.key] || 'event_vendor';
  // Derive business_id from the persona key (mirrors the PersonaContext logic)
  const businessId = `biz-${currentPersona.key.replace(/_/g, '-')}`;

  /** Convert ApiJob messages array to our local Message shape */
  const extractMessages = (job: Awaited<ReturnType<typeof postMessage>>): Message[] => {
    const messages = job.messages ?? [];
    const rendered: Message[] = messages
      .filter((m) => (m.sender as string) !== 'system')
      .map((m) => ({
        id: m.message_id,
        sender: m.sender as 'client' | 'agent' | 'sme',
        text: m.text,
        messageType: m.message_type,
        quote:
          m.message_type === 'QUOTE' && job.quote
            ? {
                id: job.quote.id,
                job_id: job.quote.job_id,
                line_items: job.quote.line_items,
                contingencies: job.quote.contingencies,
                subtotal: job.quote.subtotal,
                total: job.quote.total,
                status: (job.quote.status.toLowerCase() === 'sent' ? 'sent' : 'awaiting_approval') as QuoteStatus,
                currency: job.quote.currency ?? 'NGN',
                validity_days: job.quote.validity_days,
                payment_terms: job.quote.payment_terms,
                assumptions: job.quote.assumptions,
                created_at: job.quote.created_at,
                updated_at: job.quote.updated_at,
              }
            : undefined,
        timestamp: m.created_at,
      }));

    if (job.state === 'FAILED_RETRY' && !rendered.some((message) => message.sender === 'agent')) {
      rendered.push({
        id: `failed-retry-${job.job_id}`,
        sender: 'agent',
        text: 'Thanks for the details. I’m reviewing the best way to scope this request with the business owner so we can come back with practical options.',
        messageType: 'TEXT',
        timestamp: new Date().toISOString(),
      });
    }

    return rendered;
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  const resetConversation = () => {
    setJobId(null);
    setMessages([]);
    setInput('');
    setIsSending(false);
    setErrorMsg(null);
    setSelectedPersonaId(CLIENT_PERSONAS[0].id);
    localStorage.removeItem('billam_active_job_id');
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    // Optimistically add client message
    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      sender: 'client',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput('');
    setIsSending(true);
    setErrorMsg(null);

    try {
      let activeJobId = jobId;

      // 1. If no job exists yet, create it silently
      if (!activeJobId) {
        const job = await createJob({ business_id: businessId, business_type: businessType });
        activeJobId = job.job_id;
        setJobId(activeJobId);
        localStorage.setItem('billam_active_job_id', activeJobId);
      }

      // 2. Send the message to the active job
      const updated = await postMessage(activeJobId, { text, sender: 'client' });
      // Replace with server-authoritative messages
      setMessages(extractMessages(updated));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setErrorMsg(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-6 max-w-[900px] mx-auto space-y-4">
      {/* ── Page Header ── */}
      <div
        className="bg-white border border-[#E7E7E3] rounded-[20px] px-5 py-4"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[17px] font-bold text-[#171817]">Chat Simulator</h1>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-100">
                Live Agent
              </span>
            </div>
            <p className="text-[13px] text-[#6F716E]">
              Experience BillAm from the client&apos;s side — responses come directly from the AI
              agent
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Persona selector */}
            <div className="relative" ref={selectorRef}>
              <button
                onClick={() => setSelectorOpen(!selectorOpen)}
                disabled={!!jobId} // Disable if a job is active
                className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E7E7E3] rounded-xl text-[13px] font-semibold text-[#171817] hover:bg-[#F5F5F3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ backgroundColor: selectedPersona.avatarColor }}
                >
                  {selectedPersona.avatar}
                </span>
                <span className="max-w-[130px] truncate">{selectedPersona.name}</span>
                <Icon
                  name="ChevronDownIcon"
                  size={13}
                  className={`text-[#999C98] transition-transform ${selectorOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {selectorOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#E7E7E3] rounded-[16px] py-1.5 z-50"
                  style={{
                    boxShadow: '0 4px 6px rgba(20,25,20,0.04), 0 12px 40px rgba(20,25,20,0.10)',
                  }}
                >
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">
                    Select Client Persona
                  </p>
                  {CLIENT_PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersonaId(persona.id);
                        setSelectorOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 transition-colors ${
                        selectedPersonaId === persona.id ? 'bg-[#F0FFF6]' : 'hover:bg-[#FAFAF9]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: persona.avatarColor }}
                        >
                          {persona.avatar}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p
                              className={`text-[13px] font-semibold truncate ${selectedPersonaId === persona.id ? 'text-[#079A4F]' : 'text-[#171817]'}`}
                            >
                              {persona.name}
                            </p>
                            {selectedPersonaId === persona.id && (
                              <Icon
                                name="CheckIcon"
                                size={12}
                                className="text-[#19D66B] shrink-0"
                              />
                            )}
                          </div>
                          <p className="text-[11px] text-[#999C98] mt-0.5 truncate">
                            {persona.role} · {persona.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={resetConversation}
              className="flex items-center gap-1.5 px-3 py-2 border border-[#E7E7E3] bg-white text-[#6F716E] text-[13px] font-semibold rounded-xl hover:bg-[#F5F5F3] hover:text-[#171817] transition-colors"
              style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
            >
              <Icon name="ArrowPathIcon" size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Client Persona Info Card ── */}
      <div
        className="bg-white border border-[#E7E7E3] rounded-[20px] px-5 py-3 flex flex-wrap items-center gap-4"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
            style={{ backgroundColor: selectedPersona.avatarColor }}
          >
            {selectedPersona.avatar}
          </span>
          <div>
            <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">
              Client Persona
            </p>
            <p className="text-[13px] font-semibold text-[#171817]">{selectedPersona.name}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-[#E7E7E3] hidden sm:block" />
        <div>
          <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">Role</p>
          <p className="text-[13px] font-semibold text-[#171817]">{selectedPersona.role}</p>
        </div>
        <div className="w-px h-8 bg-[#E7E7E3] hidden sm:block" />
        <div>
          <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">
            Business
          </p>
          <p className="text-[13px] font-semibold text-[#171817]">{currentPersona.label}</p>
        </div>
        {jobId && (
          <>
            <div className="w-px h-8 bg-[#E7E7E3] hidden sm:block" />
            <div>
              <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">
                Job ID
              </p>
              <p className="text-[11px] font-mono text-[#079A4F] truncate max-w-[160px]">{jobId}</p>
            </div>
          </>
        )}
        <div className="ml-auto">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full border border-blue-100">
            You are the client
          </span>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {errorMsg && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-[14px] text-red-700 text-[13px]">
          <Icon name="ExclamationCircleIcon" size={16} className="shrink-0 text-red-500" />
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="ml-auto shrink-0 text-red-400 hover:text-red-600"
          >
            <Icon name="XMarkIcon" size={14} />
          </button>
        </div>
      )}

      {/* ── Conversation Panel ── */}
      <div
        className="bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)',
          height: 'clamp(420px, 55vh, 600px)',
        }}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7E7E3] bg-[#FAFAF9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#19D66B] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                <path
                  d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V13C19 14.1 18.1 15 17 15H12L8 19V15H5C3.9 15 3 14.1 3 13V4Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <path
                  d="M11 6L11.8 8.2L14 9L11.8 9.8L11 12L10.2 9.8L8 9L10.2 8.2L11 6Z"
                  fill="#19D66B"
                />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#171817]">BillAm</p>
              <p className="text-[11px] text-[#999C98]">AI Quoting Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${jobId ? 'bg-[#19D66B] animate-pulse' : 'bg-[#999C98]'}`}
            />
            <span
              className={`text-[11px] font-semibold ${jobId ? 'text-[#19D66B]' : 'text-[#999C98]'}`}
            >
              {jobId ? 'Active' : 'Idle'}
            </span>
          </div>
        </div>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          style={{ background: '#F0F0EE' }}
        >
          {/* ── Active messages ── */}
          {messages.map((msg) => {
            const isClient = msg.sender === 'client';
            const isAgent = msg.sender === 'agent';
            const isSme = msg.sender === 'sme';
            const isQuote = msg.messageType === 'QUOTE' && msg.quote;

            return (
              <div key={msg.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                {(isAgent || isSme) && (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-auto mb-1 shrink-0 ${isSme ? 'bg-amber-400' : 'bg-[#19D66B]'}`}
                  >
                    {isSme ? (
                      <Icon name="UserCircleIcon" size={12} className="text-white" />
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 22 22" fill="none">
                        <path
                          d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V13C19 14.1 18.1 15 17 15H12L8 19V15H5C3.9 15 3 14.1 3 13V4Z"
                          fill="white"
                          fillOpacity="0.9"
                        />
                      </svg>
                    )}
                  </div>
                )}
                <div
                  className={`${isQuote ? 'w-[min(100%,620px)]' : 'max-w-[78%]'} flex flex-col gap-1 ${isClient ? 'items-end' : 'items-start'}`}
                >
                  {isSme && (
                    <span className="text-[10px] font-semibold text-amber-600 px-1">SME</span>
                  )}
                  {isQuote ? (
                    <ClientQuoteCard quote={msg.quote!} intro={msg.text} />
                  ) : (
                    <div
                      className={`px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                        isClient
                          ? 'bg-white text-[#171817] rounded-br-sm'
                          : isSme
                            ? 'bg-amber-50 text-[#171817] rounded-bl-sm border border-amber-200'
                            : 'bg-[#DDFBEA] text-[#171817] rounded-bl-sm'
                      }`}
                      style={isClient ? { boxShadow: '0 1px 3px rgba(20,25,20,0.06)' } : {}}
                    >
                      {msg.text}
                    </div>
                  )}
                  <span className="text-[11px] text-[#999C98] px-1" suppressHydrationWarning>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator — agent thinking */}
          {isSending && (
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full bg-[#19D66B] flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V13C19 14.1 18.1 15 17 15H12L8 19V15H5C3.9 15 3 14.1 3 13V4Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
              <div className="bg-[#DDFBEA] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#19D66B] typing-dots"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#19D66B] typing-dots"
                  style={{ animationDelay: '200ms' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#19D66B] typing-dots"
                  style={{ animationDelay: '400ms' }}
                />
              </div>
              <span className="text-[11px] text-[#6F716E] mb-1">BillAm is thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Composer ── */}
        <div className="px-3 py-3 border-t border-[#E7E7E3] bg-white shrink-0">
          <div className="flex items-center gap-2 bg-[#F5F5F3] border border-[#E7E7E3] rounded-xl px-3 py-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
              style={{ backgroundColor: selectedPersona.avatarColor }}
            >
              {selectedPersona.avatar}
            </span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              placeholder={`Type as ${selectedPersona.name}...`}
              rows={1}
              className="flex-1 min-h-5 max-h-32 resize-none overflow-hidden bg-transparent text-[13px] leading-5 text-[#171817] placeholder:text-[#999C98] outline-hidden"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="p-1.5 rounded-lg bg-[#19D66B] text-white hover:bg-[#079A4F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="PaperAirplaneIcon" size={14} />
            </button>
          </div>
          <p className="text-[11px] text-[#999C98] mt-1.5 px-1">
            Simulating as{' '}
            <span className="font-semibold" style={{ color: selectedPersona.avatarColor }}>
              {selectedPersona.name}
            </span>{' '}
            · {selectedPersona.role}
            {jobId && (
              <span className="ml-1">
                · Job <span className="font-mono text-[#079A4F]">{jobId.slice(0, 8)}…</span>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
