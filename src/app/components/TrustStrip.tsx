import React from 'react';
import Icon from '@/components/ui/AppIcon';

const stages = [
  {
    num: '01',
    label: 'Capture',
    desc: 'Client sends a message on any channel',
    icon: 'ChatBubbleLeftIcon',
  },
  {
    num: '02',
    label: 'Clarify',
    desc: 'BillAm asks only for what\'s missing',
    icon: 'QuestionMarkCircleIcon',
  },
  {
    num: '03',
    label: 'Quote',
    desc: 'A structured quote is generated instantly',
    icon: 'DocumentCheckIcon',
  },
  {
    num: '04',
    label: 'Approve',
    desc: 'You review and send with one click',
    icon: 'CheckCircleIcon',
  },
];

export default function TrustStrip() {
  return (
    <section className="py-12 border-y border-border bg-card" aria-label="How BillAm works in four stages">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          From first message to approved quote.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stages.map((stage, i) => (
            <div key={stage.num} className="relative flex flex-col items-center text-center gap-3 reveal-up" style={{ transitionDelay: `${i * 100}ms` }}>
              {/* Connector line */}
              {i < stages.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+2rem)] right-[-50%] h-px bg-border" aria-hidden="true" />
              )}
              <div className="w-10 h-10 rounded-xl bg-primary-soft border border-primary/20 flex items-center justify-center relative z-10">
                <Icon name={stage.icon as 'CheckCircleIcon'} size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-0.5">{stage.num}</p>
                <p className="text-sm font-semibold text-foreground mb-1">{stage.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}