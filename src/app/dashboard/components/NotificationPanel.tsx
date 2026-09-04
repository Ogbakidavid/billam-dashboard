'use client';

import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const notifications = [
  { id: 1, type: 'approval',  title: 'Quote ready for approval',    sub: 'Sarah Adeyemi · ₦507,000',    time: '2m ago',  unread: true },
  { id: 2, type: 'attention', title: 'New job requires attention',   sub: 'Michael Okoro · Missing venue', time: '15m ago', unread: true },
  { id: 3, type: 'complete',  title: 'Clarification completed',      sub: 'Amaka Nwosu · Event Catering', time: '1h ago',  unread: false },
  { id: 4, type: 'sent',      title: 'Quote sent to client',         sub: 'Tunde Bello · ₦195,000',       time: '3h ago',  unread: false },
  { id: 5, type: 'failed',    title: 'Job failed — budget mismatch', sub: 'Chioma Eze · 500 guests',       time: '5h ago',  unread: false },
];

const typeIcon: Record<string, { icon: string; color: string; bg: string }> = {
  approval:  { icon: 'CheckCircleIcon',       color: 'text-[#19D66B]',  bg: 'bg-[#DDFBEA]' },
  attention: { icon: 'ExclamationCircleIcon', color: 'text-amber-500',  bg: 'bg-amber-50' },
  complete:  { icon: 'SparklesIcon',          color: 'text-blue-500',   bg: 'bg-blue-50' },
  sent:      { icon: 'PaperAirplaneIcon',     color: 'text-[#19D66B]',  bg: 'bg-[#DDFBEA]' },
  failed:    { icon: 'XCircleIcon',           color: 'text-red-500',    bg: 'bg-red-50' },
};

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E7E7E3] rounded-[20px] z-50 overflow-hidden"
      style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.10)' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7E7E3]">
        <span className="text-[13px] font-semibold text-[#171817]">Notifications</span>
        <button className="text-[11px] text-[#19D66B] font-semibold hover:text-[#079A4F] transition-colors">
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.map((n) => {
          const ti = typeIcon[n.type] ?? { icon: 'BellIcon', color: 'text-[#6F716E]', bg: 'bg-[#F0F0EE]' };
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-[#FAFAF9] transition-colors cursor-pointer ${
                n.unread ? 'bg-[#F0FFF6]' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5 ${ti.bg}`}>
                <Icon name={ti.icon} size={15} className={ti.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#171817] leading-tight">{n.title}</p>
                <p className="text-[11px] text-[#999C98] mt-0.5 truncate">{n.sub}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] text-[#999C98]">{n.time}</span>
                {n.unread && <span className="w-2 h-2 bg-[#19D66B] rounded-full" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-[#E7E7E3]">
        <button className="text-[11px] text-[#19D66B] font-semibold hover:text-[#079A4F] transition-colors w-full text-center">
          View all activity
        </button>
      </div>
    </div>
  );
}
