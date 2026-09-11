'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white border border-[#E7E7E3] rounded-[20px] ${className}`}
    style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
  >
    {children}
  </div>
);

const helpItems = [
  {
    icon: 'BookOpenIcon',
    title: 'Documentation',
    description: 'Read the full BillAm documentation, guides, and API reference.',
    action: 'View Docs',
    color: 'text-[#19D66B]',
    bg: 'bg-[#DDFBEA]',
  },
  {
    icon: 'ChatBubbleLeftRightIcon',
    title: 'Contact Support',
    description: 'Get help from the BillAm support team via email or live chat.',
    action: 'Get Help',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: 'LightBulbIcon',
    title: 'Feature Requests',
    description: 'Suggest new features or vote on existing ideas from the community.',
    action: 'Submit Idea',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#171817]">Help & Support</h2>
        <p className="text-[12px] text-[#6F716E] mt-0.5">Resources and support for using BillAm.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {helpItems.map((item) => (
          <Card key={item.title} className="p-4 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${item.bg}`}>
              <Icon name={item.icon} size={20} className={item.color} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#171817]">{item.title}</p>
              <p className="text-[12px] text-[#6F716E] mt-1 leading-relaxed">{item.description}</p>
            </div>
            <button className={`self-start px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-colors ${item.bg} ${item.color} border-transparent hover:opacity-80`}>
              {item.action}
            </button>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-[#E7E7E3]">
          <h3 className="text-[14px] font-semibold text-[#171817]">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-[#E7E7E3]">
          {[
            { q: 'How does the agent generate quotes?', a: 'The agent extracts key details from client messages, checks your knowledge base and pricing, then drafts a quote for your review and approval.' },
            { q: 'What happens when a client sends a message?', a: 'A new job is created. The agent ingests the message, reasons about the request, and either clarifies with the client or drafts a quote — depending on the information available.' },
            { q: 'When does the agent need my input?', a: 'The agent escalates to you when it cannot resolve a clarification after two rounds, or when a quote is ready for your approval before being sent to the client.' },
            { q: 'How do I add my pricing to the knowledge base?', a: 'Go to Settings → Business Profile → Knowledge Base and add a new entry with category "Pricing". Once it reaches Ready status, the agent will reference it.' },
          ].map((faq, i) => (
            <div key={i} className="px-5 py-4">
              <p className="text-[13px] font-semibold text-[#171817]">{faq.q}</p>
              <p className="text-[12px] text-[#6F716E] mt-1.5 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
