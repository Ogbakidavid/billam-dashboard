import React from 'react';
import Icon from '@/components/ui/AppIcon';

const traditionalSteps = [
  'Client sends incomplete message',
  'You ask for more details',
  'Wait for reply',
  'Ask again for missing info',
  'Calculate manually',
  'Build quote in spreadsheet',
  'Send quote',
  'Follow up for approval',
];

const billamSteps = [
  { text: 'Client sends a message', accent: false },
  { text: 'BillAm extracts all details', accent: true },
  { text: 'BillAm asks what\'s missing', accent: true },
  { text: 'BillAm builds the quote', accent: true },
  { text: 'You review in seconds', accent: false },
  { text: 'Send with one click', accent: false },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 px-4" aria-labelledby="problem-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <h2 id="problem-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            Your clients don&apos;t send complete briefs.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Every service business deals with the same problem. BillAm solves it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="reveal-up bg-card border border-border rounded-3xl p-8 card-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon name="ClockIcon" size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Traditional workflow</p>
                  <p className="text-xs text-muted-foreground">Manual, slow, frustrating</p>
                </div>
              </div>
              <div className="space-y-2">
                {traditionalSteps?.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-muted-foreground">{i + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{step}</p>
                    {i < traditionalSteps?.length - 1 && (
                      <Icon name="ArrowDownIcon" size={10} className="text-border ml-auto shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-muted rounded-xl border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Average time: <span className="font-semibold text-foreground">45–90 minutes</span> per quote
                </p>
              </div>
            </div>
          </div>

          {/* BillAm */}
          <div className="reveal-up stagger-2 bg-card border border-primary/30 rounded-3xl p-8 card-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/40 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Icon name="BoltIcon" size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">With BillAm</p>
                  <p className="text-xs text-primary-deep">Automated, fast, accurate</p>
                </div>
              </div>
              <div className="space-y-2">
                {billamSteps?.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      step?.accent ? 'bg-primary' : 'bg-muted border border-border'
                    }`}>
                      {step?.accent ? (
                        <Icon name="CheckIcon" size={10} className="text-primary-foreground" />
                      ) : (
                        <span className="text-[9px] font-bold text-muted-foreground">{i + 1}</span>
                      )}
                    </div>
                    <p className={`text-sm ${step?.accent ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step?.text}
                    </p>
                    {i < billamSteps?.length - 1 && (
                      <Icon name="ArrowDownIcon" size={10} className="text-primary/40 ml-auto shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-primary rounded-xl">
                <p className="text-xs text-primary-foreground text-center">
                  Average time: <span className="font-semibold">Under 2 minutes</span> per quote
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}