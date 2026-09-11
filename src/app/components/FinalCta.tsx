import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function FinalCta() {
  return (
    <section id="final-cta" className="py-24 px-4 relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] blob-green pointer-events-none" aria-hidden="true" />

      <div className="max-w-4xl mx-auto relative">
        <div className="bg-card border border-border rounded-3xl card-shadow-xl p-12 md:p-16 text-center relative overflow-hidden">
          {/* Green accent top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 pointer-events-none" />

          <div className="relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-soft border border-primary/20 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary-deep">Early access now open</span>
            </div>

            <h2 id="cta-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
              Stop turning every client message into manual work.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Let BillAm handle the conversation. You handle the business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-deep transition-all duration-200 green-glow hover:shadow-green-glow-lg text-base"
              >
                Get Started
                <Icon name="ArrowRightIcon" size={18} className="text-primary-foreground" />
              </Link>
              <Link
                href="#product-demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border text-foreground font-semibold rounded-xl hover:bg-secondary transition-all duration-200 card-shadow text-base"
              >
                <Icon name="PlayCircleIcon" size={18} className="text-primary" />
                Book a Demo
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {[
                { icon: 'ShieldCheckIcon', text: 'No credit card required' },
                { icon: 'BoltIcon', text: 'Set up in 5 minutes' },
                { icon: 'XMarkIcon', text: 'Cancel anytime' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <Icon name={item.icon as 'BoltIcon'} size={14} className="text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}