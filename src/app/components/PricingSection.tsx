'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const plans = [
  {
    name: 'Starter',
    tagline: 'For small service businesses',
    monthlyPrice: 9900,
    annualPrice: 7900,
    currency: '₦',
    period: '/month',
    description: 'Everything you need to get started with AI-powered quoting.',
    features: [
      'Up to 50 quotes per month',
      'AI client intake',
      'Smart clarification',
      'Quote generation',
      'Human approval flow',
      'Email support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    tagline: 'For growing teams',
    monthlyPrice: 24900,
    annualPrice: 19900,
    currency: '₦',
    period: '/month',
    description: 'More capacity and advanced features for businesses scaling fast.',
    features: [
      'Unlimited quotes',
      'Everything in Starter',
      'Budget gap detection',
      'Conversation history',
      'Audit trail',
      'Quote editing',
      'Priority support',
      'Team access (3 users)',
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Custom',
    tagline: 'For larger operations',
    monthlyPrice: null,
    annualPrice: null,
    currency: '₦',
    period: '',
    description: 'Custom pricing, dedicated support, and enterprise-grade features.',
    features: [
      'Everything in Growth',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom pricing rules',
      'White-label options',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-4" aria-labelledby="pricing-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">Pricing</span>
          <h2 id="pricing-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            No hidden fees. No surprises. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-xl p-1.5 card-shadow">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                !annual ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                annual ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
              <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal-up rounded-3xl p-8 transition-all duration-300 stagger-${i + 1} ${
                plan.highlight
                  ? 'bg-foreground text-background card-shadow-xl scale-[1.02] relative'
                  : 'bg-card border border-border card-shadow hover:card-shadow-lg'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? 'text-background' : 'text-foreground'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mb-4 ${plan.highlight ? 'text-background/60' : 'text-muted-foreground'}`}>
                  {plan.tagline}
                </p>

                {plan.monthlyPrice !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-medium ${plan.highlight ? 'text-background/70' : 'text-muted-foreground'}`}>
                      {plan.currency}
                    </span>
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-background' : 'text-foreground'}`}>
                      {(annual ? plan.annualPrice! : plan.monthlyPrice).toLocaleString()}
                    </span>
                    <span className={`text-sm ${plan.highlight ? 'text-background/60' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  </div>
                ) : (
                  <p className={`text-3xl font-bold ${plan.highlight ? 'text-background' : 'text-foreground'}`}>
                    Custom
                  </p>
                )}
              </div>

              <p className={`text-sm mb-6 leading-relaxed ${plan.highlight ? 'text-background/70' : 'text-muted-foreground'}`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      plan.highlight ? 'bg-primary' : 'bg-primary-soft'
                    }`}>
                      <Icon name="CheckIcon" size={10} className={plan.highlight ? 'text-primary-foreground' : 'text-primary'} />
                    </div>
                    <span className={`text-sm ${plan.highlight ? 'text-background/80' : 'text-muted-foreground'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground hover:bg-primary-bright green-glow'
                    : 'bg-background border border-border text-foreground hover:bg-secondary'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          All prices in Nigerian Naira (₦). No payment processing connected — this is a design prototype.
        </p>
      </div>
    </section>
  );
}