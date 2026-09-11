import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 px-4 bg-card border-y border-border" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">Features</span>
          <h2 id="features-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            Everything you need to quote faster.
          </h2>
        </div>

        {/* BENTO GRID AUDIT:
          Array has 8 cards: [AIIntake, SmartClarification, AutoQuoting, HumanApproval, BudgetAwareness, ConversationHistory, AuditTrail, QuoteEditing]
          4-column grid:
          Row 1: [col-1-2: AIIntake cs-2] [col-3: SmartClarification cs-1] [col-4: AutoQuoting cs-1]
          Row 2: [col-1: HumanApproval cs-1] [col-2: BudgetAwareness cs-1] [col-3-4: ConversationHistory cs-2]
          Row 3: [col-1-2: AuditTrail cs-2] [col-3-4: QuoteEditing cs-2]
          Placed 8/8 cards ✓
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {/* AIIntake — col-span-2 */}
          <div className="lg:col-span-2 reveal-up bg-background border border-border rounded-3xl p-8 card-shadow hover:card-shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center mb-4">
                <Icon name="SparklesIcon" size={20} className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">AI Client Intake</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Automatically turn messy client messages into structured briefs. No forms, no templates — just natural conversation.
              </p>
              <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground text-xs px-3 py-2 rounded-xl rounded-tl-sm max-w-[75%]">
                    I need a tailor for my wedding suit, it&apos;s in 3 weeks, I&apos;m thinking navy blue...
                  </div>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="BoltIcon" size={10} className="text-primary-foreground" />
                  </div>
                  <span className="text-xs text-primary font-medium">Extracting: Occasion, Color, Timeline...</span>
                </div>
              </div>
            </div>
          </div>

          {/* SmartClarification */}
          <div className="reveal-up stagger-1 bg-background border border-border rounded-3xl p-6 card-shadow hover:card-shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <Icon name="QuestionMarkCircleIcon" size={20} className="text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">Smart Clarification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ask only for information that&apos;s still missing. One targeted question at a time.
            </p>
          </div>

          {/* AutoQuoting */}
          <div className="reveal-up stagger-2 bg-background border border-border rounded-3xl p-6 card-shadow hover:card-shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <Icon name="DocumentCheckIcon" size={20} className="text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">Automatic Quoting</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Generate quotes from your business pricing rules and service catalog automatically.
            </p>
          </div>

          {/* HumanApproval */}
          <div className="reveal-up stagger-1 bg-primary border border-primary rounded-3xl p-6 card-shadow hover:shadow-green-glow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Icon name="UserCircleIcon" size={20} className="text-primary-foreground" />
            </div>
            <h3 className="text-base font-bold text-primary-foreground mb-2">Human Approval</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Nothing gets sent until you approve it. You stay in control of every quote.
            </p>
          </div>

          {/* BudgetAwareness */}
          <div className="reveal-up stagger-2 bg-background border border-border rounded-3xl p-6 card-shadow hover:card-shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <Icon name="ScaleIcon" size={20} className="text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">Budget Awareness</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Identify when a requested scope doesn&apos;t fit the client&apos;s stated budget.
            </p>
          </div>

          {/* ConversationHistory — col-span-2 */}
          <div className="lg:col-span-2 reveal-up stagger-3 bg-background border border-border rounded-3xl p-8 card-shadow hover:card-shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <Icon name="ClockIcon" size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Conversation History</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              See exactly what the client said and how the brief evolved from first message to final quote.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['Message received', 'Brief extracted', 'Quote generated']?.map((label, i) => (
                <div key={label} className="bg-card border border-border rounded-xl p-2.5 text-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                    <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AuditTrail — col-span-2 */}
          <div className="lg:col-span-2 reveal-up stagger-2 bg-background border border-border rounded-3xl p-8 card-shadow hover:card-shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <Icon name="ShieldCheckIcon" size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Audit Trail</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Know what happened at every stage. Full log of every action, edit, and approval.
            </p>
            <div className="space-y-2">
              {[
                { time: '10:32 AM', event: 'Client message received', color: 'bg-muted' },
                { time: '10:32 AM', event: 'Brief extracted by BillAm', color: 'bg-primary-soft' },
                { time: '10:33 AM', event: 'Draft quote generated', color: 'bg-primary-soft' },
                { time: '10:41 AM', event: 'Quote approved by you', color: 'bg-primary' },
              ]?.map((row) => (
                <div key={row?.event} className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground w-16 shrink-0">{row?.time}</span>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${row?.color}`} />
                  <span className="text-xs text-foreground">{row?.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QuoteEditing — col-span-2 */}
          <div className="lg:col-span-2 reveal-up stagger-3 bg-background border border-border rounded-3xl p-8 card-shadow hover:card-shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <Icon name="PencilSquareIcon" size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Quote Editing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Adjust line items, change pricing, or add notes before sending. The final quote is always yours.
            </p>
            <div className="bg-card border border-border rounded-xl p-3 space-y-2">
              {[
                { item: 'Catering service', amount: '₦320,000', editable: false },
                { item: 'Logistics', amount: '₦35,000', editable: true },
              ]?.map((row) => (
                <div key={row?.item} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{row?.item}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{row?.amount}</span>
                    {row?.editable && (
                      <div className="w-5 h-5 rounded-md bg-primary-soft flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                        <Icon name="PencilIcon" size={10} className="text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}