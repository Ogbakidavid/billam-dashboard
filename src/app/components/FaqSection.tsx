'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const faqs = [
  {
    q: 'What does BillAm actually do?',
    a: 'BillAm is an AI agent that handles client intake conversations. When a client sends you a message describing what they need, BillAm reads it, extracts the key details, asks for anything that\'s missing, and generates a structured quote — all before you have to get involved. You review and approve before anything goes to the client.',
  },
  {
    q: 'Does BillAm replace my staff?',
    a: 'No. BillAm handles the repetitive, time-consuming part of intake and quoting. Your team still manages client relationships, handles complex decisions, and approves every quote. Think of BillAm as a very capable assistant that handles the administrative work.',
  },
  {
    q: 'Can I review quotes before they\'re sent?',
    a: 'Yes — always. This is a core principle of BillAm. Nothing is sent to your client until you explicitly approve it. You can review, edit, add notes, or reject any generated quote.',
  },
  {
    q: 'Can BillAm handle incomplete client requests?',
    a: 'Yes, that\'s exactly what it\'s designed for. When a client sends an incomplete brief, BillAm identifies what\'s missing and asks one targeted question at a time — naturally, in conversation — until it has everything needed to build the quote.',
  },
  {
    q: 'Can I edit generated quotes?',
    a: 'Absolutely. Every generated quote can be edited before you approve it. You can adjust line items, change pricing, add or remove services, and add custom notes. The final quote is always yours.',
  },
  {
    q: 'Does BillAm work with WhatsApp?',
    a: 'BillAm is designed to work with WhatsApp Business, email, and web intake forms. WhatsApp integration is available on Growth and Custom plans. During early access, the demo shows WhatsApp-style conversations.',
  },
  {
    q: 'How does BillAm use my business pricing?',
    a: 'You provide BillAm with your service catalog and pricing rules during setup. BillAm uses this information to generate quotes that match your actual pricing — not generic estimates. You can update your pricing rules at any time.',
  },
  {
    q: 'What happens when a request doesn\'t fit the budget?',
    a: 'BillAm detects when the requested scope exceeds the client\'s stated budget and flags it clearly. It shows you the gap and suggests options — like removing items or adjusting scope — so you can make an informed decision before presenting the quote.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-4 bg-card border-y border-border" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">FAQ</span>
          <h2 id="faq-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about BillAm.
          </p>
        </div>

        <div className="space-y-2">
          {faqs?.map((faq, i) => (
            <div
              key={i}
              className="reveal-up bg-background border border-border rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-inset rounded-2xl"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-semibold text-foreground pr-4">{faq?.q}</span>
                <div className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-45 bg-primary' : ''}`}>
                  <Icon name="PlusIcon" size={14} className={openIndex === i ? 'text-primary-foreground' : 'text-muted-foreground'} />
                </div>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq?.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}