import React from 'react';
import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    num: '01',
    title: 'Client sends a message',
    desc: 'A client reaches out via WhatsApp, email, or your intake form. No special format required — they just describe what they need.',
    icon: 'ChatBubbleLeftIcon',
    ui: (
      <div className="bg-background rounded-xl p-3 border border-border space-y-2">
        <div className="flex justify-start">
          <div className="bg-muted text-foreground text-[10px] px-3 py-2 rounded-xl rounded-tl-sm max-w-[85%] leading-relaxed">
            Hi! I need a decorator for my daughter&apos;s naming ceremony on the 14th. About 80 guests.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground text-[10px] px-3 py-2 rounded-xl rounded-tr-sm max-w-[85%]">
            Got it! Let me gather a few more details...
          </div>
        </div>
      </div>
    ),
  },
  {
    num: '02',
    title: 'BillAm understands the brief',
    desc: 'BillAm reads the message and instantly extracts every piece of useful information — event type, date, guest count, location, and more.',
    icon: 'SparklesIcon',
    ui: (
      <div className="bg-background rounded-xl p-3 border border-border space-y-1.5">
        {[
          { k: 'Event', v: 'Naming Ceremony' },
          { k: 'Date', v: '14th of month' },
          { k: 'Guests', v: '80 people' },
        ].map((row) => (
          <div key={row.k} className="flex items-center justify-between bg-card border border-border rounded-lg px-2.5 py-1.5">
            <span className="text-[10px] text-muted-foreground">{row.k}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-foreground">{row.v}</span>
              <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                <Icon name="CheckIcon" size={8} className="text-primary-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '03',
    title: 'BillAm asks what\'s missing',
    desc: 'If any critical detail is absent, BillAm asks a targeted question — not a long form. One question at a time, naturally.',
    icon: 'QuestionMarkCircleIcon',
    ui: (
      <div className="bg-background rounded-xl p-3 border border-border space-y-2">
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground text-[10px] px-3 py-2 rounded-xl rounded-tr-sm max-w-[85%]">
            What&apos;s your approximate budget for the decoration?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-muted text-foreground text-[10px] px-3 py-2 rounded-xl rounded-tl-sm max-w-[85%]">
            Around ₦200,000.
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-1">
          <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
            <Icon name="CheckIcon" size={8} className="text-primary-foreground" />
          </div>
          <span className="text-[10px] text-primary font-medium">Brief complete</span>
        </div>
      </div>
    ),
  },
  {
    num: '04',
    title: 'You approve the quote',
    desc: 'BillAm generates a structured quote based on your pricing rules. You review, edit if needed, and send — all in under a minute.',
    icon: 'CheckBadgeIcon',
    ui: (
      <div className="bg-primary rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-primary-foreground">Draft Quote Ready</span>
          <span className="text-[9px] bg-white/20 text-primary-foreground px-1.5 py-0.5 rounded-full">Review</span>
        </div>
        <p className="text-2xl font-bold text-primary-foreground">₦215,000</p>
        <p className="text-[10px] text-primary-foreground/70">Naming ceremony · 80 guests</p>
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button className="py-1.5 bg-white/20 text-primary-foreground text-[9px] font-medium rounded-lg">
            Edit
          </button>
          <button className="py-1.5 bg-white text-primary text-[9px] font-semibold rounded-lg">
            Approve ✓
          </button>
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4" aria-labelledby="how-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">Process</span>
          <h2 id="how-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            How BillAm works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Four steps from client message to approved quote.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`reveal-up bg-card border border-border rounded-3xl p-6 card-shadow hover:card-shadow-lg transition-all duration-300 space-y-4 stagger-${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-foreground/10">{step.num}</span>
                <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center">
                  <Icon name={step.icon as 'CheckBadgeIcon'} size={18} className="text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
              {step.ui}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}