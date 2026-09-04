import React from 'react';
import Icon from '@/components/ui/AppIcon';

const scopeItems = [
  { label: 'Premium décor', cost: '₦85,000' },
  { label: 'Stage setup', cost: '₦60,000' },
  { label: 'Lighting rig', cost: '₦75,000' },
  { label: 'Entrance arch', cost: '₦45,000' },
  { label: 'Seating arrangement', cost: '₦90,000' },
  { label: 'Logistics', cost: '₦60,000' },
];

export default function QuoteIntelligence() {
  return (
    <section id="quote-intelligence" className="py-20 px-4 bg-card border-y border-border" aria-labelledby="qi-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">Budget Intelligence</span>
          <h2 id="qi-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            When scope doesn&apos;t match budget, BillAm tells you.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            BillAm identifies the gap and helps you decide what to adjust — before you waste time on a quote that won&apos;t land.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Client Budget */}
          <div className="reveal-up bg-background border border-border rounded-3xl p-6 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                <Icon name="UserIcon" size={16} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">Client Budget</p>
            </div>
            <div className="bg-muted rounded-2xl p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-1">Stated budget</p>
              <p className="text-3xl font-bold text-foreground">₦350,000</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Requested scope</p>
              {scopeItems?.map((item) => (
                <div key={item?.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground">{item?.label}</span>
                  <span className="text-xs font-medium text-foreground">{item?.cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gap Analysis */}
          <div className="reveal-up stagger-2 bg-background border border-primary/30 rounded-3xl p-6 card-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-soft/30 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                  <Icon name="BoltIcon" size={16} className="text-primary-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">BillAm Analysis</p>
              </div>

              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Generated estimate</p>
                  <p className="text-3xl font-bold text-foreground">₦415,000</p>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="ExclamationTriangleIcon" size={16} className="text-red-500" />
                    <p className="text-sm font-semibold text-red-700">Budget gap detected</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-red-600">₦65,000</span>
                    <span className="text-sm text-red-500">over budget</span>
                  </div>
                  <p className="text-xs text-red-500 mt-1">18.6% above stated budget</p>
                </div>

                <div className="bg-primary-soft border border-primary/20 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-primary-deep mb-2">BillAm suggests:</p>
                  <p className="text-xs text-foreground leading-relaxed">
                    Remove lighting rig (₦75k) to bring quote within budget, or discuss a revised budget with the client.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution */}
          <div className="reveal-up stagger-3 bg-background border border-border rounded-3xl p-6 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-soft flex items-center justify-center">
                <Icon name="CheckCircleIcon" size={16} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Your Decision</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              You choose how to handle the gap. BillAm gives you the options — you make the call.
            </p>
            <div className="space-y-2 mb-6">
              {[
                { label: 'Remove lighting rig', saving: '-₦75,000', selected: true },
                { label: 'Reduce staff count', saving: '-₦32,000', selected: false },
                { label: 'Discuss revised budget', saving: 'Client call', selected: false },
              ]?.map((option) => (
                <button
                  key={option?.label}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                    option?.selected
                      ? 'bg-primary-soft border-primary/30' :'bg-muted border-border hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      option?.selected ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {option?.selected && <Icon name="CheckIcon" size={8} className="text-primary-foreground" />}
                    </div>
                    <span className="text-xs font-medium text-foreground">{option?.label}</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${option?.selected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {option?.saving}
                  </span>
                </button>
              ))}
            </div>
            <div className="bg-primary rounded-2xl p-4">
              <p className="text-xs text-primary-foreground/70 mb-1">Revised quote</p>
              <p className="text-2xl font-bold text-primary-foreground">₦340,000</p>
              <p className="text-[10px] text-primary-foreground/70 mt-1">Within budget ✓</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}