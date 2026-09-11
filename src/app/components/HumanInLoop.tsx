import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function HumanInLoop() {
  return (
    <section id="human-in-loop" className="py-20 px-4" aria-labelledby="human-heading">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="reveal-up space-y-6">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest">Control</span>
            <h2 id="human-heading" className="text-section font-bold text-foreground tracking-tight">
              AI handles the work.{' '}
              <span className="text-gradient-green">You keep the decision.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              BillAm can handle the conversation and build the quote. But you remain the final approval point — nothing reaches your client without your explicit sign-off.
            </p>
            <div className="space-y-4">
              {[
                { icon: 'ShieldCheckIcon', title: 'You approve every quote', desc: 'No quote is sent without your review and explicit approval.' },
                { icon: 'PencilSquareIcon', title: 'Edit before sending', desc: 'Adjust any line item, price, or note before the quote leaves your account.' },
                { icon: 'EyeIcon', title: 'Full visibility', desc: 'See the complete conversation history and brief at any time.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name={item.icon as 'EyeIcon'} size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="reveal-scale stagger-2">
            <div className="bg-card border border-border rounded-3xl card-shadow-xl p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                {/* BillAm notification */}
                <div className="flex items-center gap-3 p-4 bg-primary-soft border border-primary/20 rounded-2xl mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Icon name="BoltIcon" size={18} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">BillAm</p>
                    <p className="text-xs text-muted-foreground">Draft quote ready for your review</p>
                  </div>
                  <span className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-full font-medium">New</span>
                </div>

                {/* Quote card */}
                <div className="bg-background border border-border rounded-2xl p-5 mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Client: Adaeze Okonkwo</p>
                      <p className="text-xs text-muted-foreground">Event catering · 120 guests · Ikeja</p>
                    </div>
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded-full">Draft</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-foreground">₦507,000</span>
                    <span className="text-sm text-muted-foreground">.00</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      { item: 'Food & Beverages', cost: '₦320,000' },
                      { item: 'Service Staff', cost: '₦96,000' },
                      { item: 'Equipment & Setup', cost: '₦91,000' },
                    ].map((row) => (
                      <div key={row.item} className="flex justify-between py-1.5 border-b border-border last:border-0">
                        <span className="text-xs text-muted-foreground">{row.item}</span>
                        <span className="text-xs font-medium text-foreground">{row.cost}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-1.5 py-3 bg-muted border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
                      <Icon name="PencilIcon" size={14} className="text-muted-foreground" />
                      Edit Quote
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-3 bg-primary rounded-xl text-sm font-semibold text-primary-foreground hover:bg-primary-deep transition-colors green-glow">
                      <Icon name="CheckIcon" size={14} className="text-primary-foreground" />
                      Approve & Send
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Your client won&apos;t see this until you hit Approve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}