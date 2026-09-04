'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Message } from '@/app/dashboard/types';
import { formatTime } from '@/lib/currency';

// ── Client Personas ────────────────────────────────────────────────────────────

interface ClientPersona {
  id: string;
  name: string;
  avatar: string;        // initials
  avatarColor: string;
  role: string;
  description: string;
  service: string;
  initialMessages: Message[];
  responses: string[];
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
    initialMessages: [
      { id: 'sa-1', sender: 'client', text: "Hi! I need full venue decoration for my wedding. 200 guests, 14th December at Eko Hotel, Lagos.", timestamp: '2026-09-01T09:00:00Z' },
      { id: 'sa-2', sender: 'agent',  text: "Congratulations on your upcoming wedding! I'd love to help. What's your budget range for the decoration?", timestamp: '2026-09-01T09:00:30Z' },
      { id: 'sa-3', sender: 'client', text: "We're thinking around ₦800,000 to ₦1,000,000.", timestamp: '2026-09-01T09:01:00Z' },
      { id: 'sa-4', sender: 'agent',  text: "Perfect. Do you have a colour theme or style in mind — classic white, floral, modern, or something else?", timestamp: '2026-09-01T09:01:20Z' },
      { id: 'sa-5', sender: 'client', text: "We want a blush pink and gold theme with lots of florals.", timestamp: '2026-09-01T09:02:00Z' },
      { id: 'sa-6', sender: 'agent',  text: "Lovely choice! I've captured all the details. I'm preparing your quote now — it will be ready shortly.", timestamp: '2026-09-01T09:02:30Z' },
    ],
    responses: [
      "Thank you! I've updated the brief with that information.",
      "Got it. I'm noting that down for the quote.",
      "Understood. Is there anything else you'd like to include?",
      "Perfect — the brief is fully populated. Your quote is being prepared.",
      "Thanks for the extra detail! I'll factor that in.",
      "Great. Is there anything else you'd like to add before I finalise the quote?",
    ],
  },
  {
    id: 'emeka',
    name: 'Emeka Okafor',
    avatar: 'EO',
    avatarColor: '#0891B2',
    role: 'Corporate Events Manager',
    description: 'Busy professional, gives minimal info upfront.',
    service: 'Corporate Event Decoration',
    initialMessages: [
      { id: 'eo-1', sender: 'client', text: "I need decoration for a corporate event.", timestamp: '2026-09-01T11:00:00Z' },
      { id: 'eo-2', sender: 'agent',  text: "Happy to help! Could you share a few more details? When is the event and how many guests are you expecting?", timestamp: '2026-09-01T11:00:20Z' },
      { id: 'eo-3', sender: 'client', text: "It's next month. About 80 people.", timestamp: '2026-09-01T11:01:00Z' },
      { id: 'eo-4', sender: 'agent',  text: "Thanks! Could you confirm the exact date and the venue location? Also, do you have a budget range in mind?", timestamp: '2026-09-01T11:01:20Z' },
    ],
    responses: [
      "Thanks for that. Could you also confirm the venue address?",
      "Got it. What's the colour scheme or branding you'd like to incorporate?",
      "Understood. Do you need stage and backdrop, or just table styling?",
      "Perfect. I now have enough information to prepare your quote.",
      "Thanks! I'll include that in the brief.",
      "Great — is there anything else you'd like to clarify before I proceed?",
    ],
  },
  {
    id: 'funke',
    name: 'Funke Balogun',
    avatar: 'FB',
    avatarColor: '#D97706',
    role: 'High-Budget Client',
    description: 'Wants something extraordinary, budget is flexible.',
    service: 'Traditional Ceremony Decor',
    initialMessages: [
      { id: 'fb-1', sender: 'client', text: "I need decoration for a traditional wedding ceremony. Very elaborate — we want something no one has ever seen before.", timestamp: '2026-09-01T14:00:00Z' },
      { id: 'fb-2', sender: 'agent',  text: "That sounds wonderful! Could you share the date, venue, guest count, and your budget range?", timestamp: '2026-09-01T14:00:30Z' },
      { id: 'fb-3', sender: 'client', text: "22nd November, Transcorp Hilton Abuja. 500 guests. Budget is flexible — we want the best.", timestamp: '2026-09-01T14:01:00Z' },
      { id: 'fb-4', sender: 'agent',  text: "Understood. For a 500-guest event at Transcorp Hilton with a flexible budget, this requires a custom proposal. I'm escalating this to our senior decorator for a personalised consultation.", timestamp: '2026-09-01T14:01:30Z' },
      { id: 'fb-5', sender: 'sme',    text: "Hi Funke, I'm Tunde from Stellar Decor. I'll be handling your event personally. Can you tell me more about the cultural elements you'd like incorporated?", timestamp: '2026-09-01T14:03:00Z' },
    ],
    responses: [
      "Thank you for that detail. I'll pass this to our team.",
      "Noted. Our senior decorator will follow up with a custom proposal.",
      "Understood. This has been escalated for a personalised consultation.",
      "Thanks — I've updated the brief with your requirements.",
      "Got it. We'll be in touch shortly with a tailored quote.",
      "Perfect. Is there anything else you'd like to add for the consultation?",
    ],
  },
  {
    id: 'chidi',
    name: 'Chidi Nwosu',
    avatar: 'CN',
    avatarColor: '#DC2626',
    role: 'Last-Minute Requester',
    description: 'Urgent timeline, needs immediate availability.',
    service: 'Outdoor Event Decoration',
    initialMessages: [
      { id: 'cn-1', sender: 'client', text: "I need full outdoor decoration for tomorrow. 300 guests, Lekki Phase 1.", timestamp: '2026-09-01T16:00:00Z' },
      { id: 'cn-2', sender: 'agent',  text: "I'd love to help! However, I need to flag that a 300-guest outdoor setup typically requires at least 5–7 days for sourcing and logistics. Could you confirm the date?", timestamp: '2026-09-01T16:00:30Z' },
      { id: 'cn-3', sender: 'client', text: "Yes, tomorrow. It's urgent.", timestamp: '2026-09-01T16:01:00Z' },
      { id: 'cn-4', sender: 'agent',  text: "I understand the urgency. Unfortunately, a full 300-guest outdoor setup cannot be safely delivered within 24 hours given our current availability. I'm flagging this for SME review — they may be able to offer a scaled-down alternative.", timestamp: '2026-09-01T16:01:30Z' },
    ],
    responses: [
      "I understand. Let me check what's feasible within your timeline.",
      "Noted. Our team will review and suggest an alternative scope.",
      "Got it. I've flagged this for urgent SME review.",
      "Understood. A scaled-down option may be possible — our team will confirm.",
      "Thanks for the context. I'll update the brief accordingly.",
      "I've noted your requirements. Our team will be in touch shortly.",
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function ChatSimulatorPage() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(CLIENT_PERSONAS[0].id);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(CLIENT_PERSONAS[0].initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const selectedPersona = CLIENT_PERSONAS.find(p => p.id === selectedPersonaId) || CLIENT_PERSONAS[0];

  // Close selector on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadPersona = (id: string) => {
    const persona = CLIENT_PERSONAS.find(p => p.id === id);
    if (!persona) return;
    setSelectedPersonaId(id);
    setMessages(persona.initialMessages);
    setResponseIndex(0);
    setInput('');
    setIsTyping(false);
    setSelectorOpen(false);
  };

  const resetConversation = () => {
    setMessages(selectedPersona.initialMessages);
    setResponseIndex(0);
    setInput('');
    setIsTyping(false);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const clientMsg: Message = {
      id: `sim-${Date.now()}`,
      sender: 'client',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, clientMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responseText = selectedPersona.responses[responseIndex % selectedPersona.responses.length];
      setResponseIndex(i => i + 1);
      const agentMsg: Message = {
        id: `sim-${Date.now() + 1}`,
        sender: 'agent',
        text: responseText,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

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
                Client Simulation
              </span>
            </div>
            <p className="text-[13px] text-[#6F716E]">Experience BillAm from the client&apos;s side</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Persona selector */}
            <div className="relative" ref={selectorRef}>
              <button
                onClick={() => setSelectorOpen(!selectorOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E7E7E3] rounded-xl text-[13px] font-semibold text-[#171817] hover:bg-[#F5F5F3] transition-colors"
                style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
              >
                {/* Avatar */}
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ backgroundColor: selectedPersona.avatarColor }}
                >
                  {selectedPersona.avatar}
                </span>
                <span className="max-w-[130px] truncate">{selectedPersona.name}</span>
                <Icon name="ChevronDownIcon" size={13} className={`text-[#999C98] transition-transform ${selectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {selectorOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#E7E7E3] rounded-[16px] py-1.5 z-50"
                  style={{ boxShadow: '0 4px 6px rgba(20,25,20,0.04), 0 12px 40px rgba(20,25,20,0.10)' }}
                >
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">Select Client Persona</p>
                  {CLIENT_PERSONAS.map(persona => (
                    <button
                      key={persona.id}
                      onClick={() => loadPersona(persona.id)}
                      className={`w-full text-left px-3 py-2.5 transition-colors ${
                        selectedPersonaId === persona.id
                          ? 'bg-[#F0FFF6]'
                          : 'hover:bg-[#FAFAF9]'
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
                            <p className={`text-[13px] font-semibold truncate ${selectedPersonaId === persona.id ? 'text-[#079A4F]' : 'text-[#171817]'}`}>
                              {persona.name}
                            </p>
                            {selectedPersonaId === persona.id && (
                              <Icon name="CheckIcon" size={12} className="text-[#19D66B] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#999C98] mt-0.5 truncate">{persona.role} · {persona.description}</p>
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

      {/* ── Client Persona Card ── */}
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
            <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">Client Persona</p>
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
          <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">Service</p>
          <p className="text-[13px] font-semibold text-[#171817]">{selectedPersona.service}</p>
        </div>
        <div className="ml-auto">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full border border-blue-100">
            You are the client
          </span>
        </div>
      </div>

      {/* ── Conversation ── */}
      <div
        className="bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)', height: 'clamp(420px, 55vh, 600px)' }}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7E7E3] bg-[#FAFAF9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#19D66B] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                <path d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V13C19 14.1 18.1 15 17 15H12L8 19V15H5C3.9 15 3 14.1 3 13V4Z" fill="white" fillOpacity="0.9"/>
                <path d="M11 6L11.8 8.2L14 9L11.8 9.8L11 12L10.2 9.8L8 9L10.2 8.2L11 6Z" fill="#19D66B"/>
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#171817]">BillAm</p>
              <p className="text-[11px] text-[#999C98]">AI Quoting Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#19D66B] animate-pulse" />
            <span className="text-[11px] text-[#19D66B] font-semibold">Active</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: '#F0F0EE' }}>
          {messages.map((msg) => {
            const isClient = msg.sender === 'client';
            const isAgent  = msg.sender === 'agent';
            const isSme    = msg.sender === 'sme';

            return (
              <div key={msg.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                {(isAgent || isSme) && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-auto mb-1 shrink-0 ${isSme ? 'bg-amber-400' : 'bg-[#19D66B]'}`}>
                    {isSme ? (
                      <Icon name="UserCircleIcon" size={12} className="text-white" />
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 22 22" fill="none">
                        <path d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V13C19 14.1 18.1 15 17 15H12L8 19V15H5C3.9 15 3 14.1 3 13V4Z" fill="white" fillOpacity="0.9"/>
                      </svg>
                    )}
                  </div>
                )}
                <div className={`max-w-[78%] flex flex-col gap-1 ${isClient ? 'items-end' : 'items-start'}`}>
                  {isSme && (
                    <span className="text-[10px] font-semibold text-amber-600 px-1">SME</span>
                  )}
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
                  <span className="text-[11px] text-[#999C98] px-1" suppressHydrationWarning>{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full bg-[#19D66B] flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 22 22" fill="none">
                  <path d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V13C19 14.1 18.1 15 17 15H12L8 19V15H5C3.9 15 3 14.1 3 13V4Z" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <div className="bg-[#DDFBEA] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19D66B] typing-dots" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#19D66B] typing-dots" style={{ animationDelay: '200ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#19D66B] typing-dots" style={{ animationDelay: '400ms' }} />
              </div>
              <span className="text-[11px] text-[#6F716E] mb-1">BillAm is thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer — client sender */}
        <div className="px-3 py-3 border-t border-[#E7E7E3] bg-white shrink-0">
          <div className="flex items-center gap-2 bg-[#F5F5F3] border border-[#E7E7E3] rounded-xl px-3 py-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
              style={{ backgroundColor: selectedPersona.avatarColor }}
            >
              {selectedPersona.avatar}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type as ${selectedPersona.name}...`}
              className="flex-1 bg-transparent text-[13px] text-[#171817] placeholder:text-[#999C98] outline-hidden"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="p-1.5 rounded-lg bg-[#19D66B] text-white hover:bg-[#079A4F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="PaperAirplaneIcon" size={14} />
            </button>
          </div>
          <p className="text-[11px] text-[#999C98] mt-1.5 px-1">
            Simulating as <span className="font-semibold" style={{ color: selectedPersona.avatarColor }}>{selectedPersona.name}</span> · {selectedPersona.role}
          </p>
        </div>
      </div>
    </div>
  );
}
