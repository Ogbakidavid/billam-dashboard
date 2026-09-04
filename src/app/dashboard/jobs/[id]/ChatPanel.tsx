'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Message, AuditEvent } from '@/app/dashboard/types';
import { formatTime } from '@/lib/currency';

// Mock initial messages using canonical Message model (sender + ISO timestamp)
const initialMessages: Message[] = [
  { id: '1', sender: 'client', text: "Hi, I need catering for my daughter's wedding. Around 120 guests.", timestamp: '2026-09-01T10:02:00Z' },
  { id: '2', sender: 'agent',  text: "Absolutely! I'd be happy to help with that. What date is the wedding and where will it be held?", timestamp: '2026-09-01T10:02:30Z' },
  { id: '3', sender: 'client', text: "It's on Saturday, 15th November in Ikeja. We're looking for a full-service catering package.", timestamp: '2026-09-01T10:04:00Z' },
  { id: '4', sender: 'agent',  text: "Perfect. Do you have a budget range in mind for the catering?", timestamp: '2026-09-01T10:04:20Z' },
  { id: '5', sender: 'client', text: "We're thinking around ₦350,000 to ₦400,000.", timestamp: '2026-09-01T10:06:00Z' },
  { id: '6', sender: 'agent',  text: "Got it. Do you have any dietary preferences or special menu requirements for the guests?", timestamp: '2026-09-01T10:06:15Z' },
  { id: '7', sender: 'client', text: "Yes, we need a mix of Nigerian and continental dishes. Also some guests are vegetarian.", timestamp: '2026-09-01T10:08:00Z' },
  { id: '8', sender: 'agent',  text: "Understood. I've captured all the details and I'm preparing a quote for you. I'll have it ready shortly.", timestamp: '2026-09-01T10:08:30Z' },
];

interface ChatPanelProps {
  jobId: string;
  /** Called when an SME message is sent — allows parent to add an audit event */
  onSmeMessage?: (event: AuditEvent) => void;
}

export default function ChatPanel({ jobId, onSmeMessage }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    // Job Detail composer always sends as SME
    const smeMsg: Message = {
      id: Date.now().toString(),
      sender: 'sme',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, smeMsg]);
    setInput('');

    // Notify parent for activity log
    if (onSmeMessage) {
      onSmeMessage({
        id: `ae-sme-${Date.now()}`,
        type: 'sme',
        label: 'SME intervention',
        detail: text,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div
      className="flex flex-col h-full bg-white border border-[#E7E7E3] rounded-[20px] overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7E7E3] bg-[#FAFAF9] shrink-0">
        <div>
          <p className="text-[13px] font-semibold text-[#171817]">Client Conversation</p>
          <p className="text-[11px] text-[#999C98]">SME Workspace</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Icon name="UserCircleIcon" size={12} />
            SME View
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#19D66B] animate-pulse" />
            <span className="text-[11px] text-[#19D66B] font-semibold">Live</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: '#F0F0EE' }}>
        {messages.map((msg) => {
          const isClient = msg.sender === 'client';
          const isAgent  = msg.sender === 'agent';
          const isSme    = msg.sender === 'sme';
          const isSystem = msg.sender === 'system';

          // Client → LEFT; Agent/SME/System → RIGHT
          const alignRight = isAgent || isSme || isSystem;

          return (
            <div key={msg.id} className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}>
              {/* Avatar for client (left side) */}
              {isClient && (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-auto mb-1 shrink-0">
                  <Icon name="UserIcon" size={12} className="text-blue-500" />
                </div>
              )}

              <div className={`max-w-[78%] flex flex-col gap-1 ${alignRight ? 'items-end' : 'items-start'}`}>
                {/* Sender label */}
                {isAgent && (
                  <span className="text-[10px] font-semibold text-[#079A4F] px-1">BillAm Agent</span>
                )}
                {isSme && (
                  <span className="text-[10px] font-semibold text-amber-600 px-1">You (SME)</span>
                )}
                {isClient && (
                  <span className="text-[10px] font-semibold text-blue-500 px-1">Client</span>
                )}

                <div
                  className={`px-3 py-2 rounded-2xl text-[13px] leading-relaxed chat-bubble-in ${
                    isClient
                      ? 'bg-white text-[#171817] rounded-bl-sm'
                      : isSme
                      ? 'bg-amber-50 text-[#171817] rounded-br-sm border border-amber-200'
                      : isAgent
                      ? 'bg-[#DDFBEA] text-[#171817] rounded-br-sm'
                      : 'bg-[#F0F0EE] text-[#6F716E] rounded-br-sm text-[12px] italic'
                  }`}
                  style={isClient ? { boxShadow: '0 1px 3px rgba(20,25,20,0.06)' } : {}}
                >
                  {msg.text}
                </div>
                <span className="text-[11px] text-[#999C98] px-1" suppressHydrationWarning>{formatTime(msg.timestamp)}</span>
              </div>

              {/* Avatar for agent/sme (right side) */}
              {isAgent && (
                <div className="w-6 h-6 rounded-full bg-[#19D66B] flex items-center justify-center ml-2 mt-auto mb-1 shrink-0">
                  <svg width="12" height="12" viewBox="0 0 22 22" fill="none">
                    <path d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V13C19 14.1 18.1 15 17 15H12L8 19V15H5C3.9 15 3 14.1 3 13V4Z" fill="white" fillOpacity="0.9"/>
                  </svg>
                </div>
              )}
              {isSme && (
                <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center ml-2 mt-auto mb-1 shrink-0">
                  <Icon name="UserCircleIcon" size={12} className="text-white" />
                </div>
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* SME Composer */}
      <div className="px-3 py-3 border-t border-[#E7E7E3] bg-white shrink-0">
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-amber-50 border-amber-200 transition-colors">
          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
            <Icon name="UserCircleIcon" size={11} className="text-white" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message as SME..."
            className="flex-1 bg-transparent text-[13px] text-[#171817] placeholder:text-[#999C98] outline-hidden"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-1.5 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="PaperAirplaneIcon" size={14} />
          </button>
        </div>
        <p className="text-[10px] text-[#999C98] mt-1.5 px-1">Messages sent here appear as SME in the conversation</p>
      </div>
    </div>
  );
}
