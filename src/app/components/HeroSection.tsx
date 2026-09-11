'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const chatMessages = [
  { from: 'client', text: 'Hi, I need catering for 120 people next Saturday in Ikeja.' },
  { from: 'billam', text: 'Got it! Just to confirm — is this an indoor or outdoor event?' },
  { from: 'client', text: 'Indoor. It\'s a birthday party.' },
  { from: 'billam', text: 'Perfect. What\'s your approximate budget range?' },
];

const briefItems = [
  { label: 'Event Type', value: 'Birthday Party', status: 'done' },
  { label: 'Guests', value: '120 people', status: 'done' },
  { label: 'Location', value: 'Ikeja, Lagos', status: 'done' },
  { label: 'Date', value: 'Next Saturday', status: 'done' },
  { label: 'Budget', value: 'Awaiting...', status: 'pending' },
];

export default function HeroSection() {
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messages = messagesRef.current?.querySelectorAll('.chat-msg');
    if (!messages) return;

    messages.forEach((msg, i) => {
      (msg as HTMLElement).style.opacity = '0';
      (msg as HTMLElement).style.transform = 'translateY(10px)';
      setTimeout(() => {
        (msg as HTMLElement).style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        (msg as HTMLElement).style.opacity = '1';
        (msg as HTMLElement).style.transform = 'translateY(0)';
      }, 400 + i * 600);
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 blob-green pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 blob-green pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="reveal-up inline-flex items-center gap-2 px-3 py-1.5 bg-primary-soft border border-primary/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary-deep tracking-wide">AI-Powered Quoting · Early Access</span>
            </div>

            {/* Headline */}
            <div className="reveal-up stagger-1 space-y-4">
              <h1
                id="hero-heading"
                className="text-hero font-bold text-foreground leading-[1.05] tracking-tight"
              >
                Turn client{' '}
                <span className="text-gradient-green">conversations</span>
                {' '}into ready-to-send quotes.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                BillAm handles the questions, gathers the details, builds the quote, and keeps you in control before anything reaches your client.
              </p>
            </div>

            {/* CTAs */}
            <div id="hero-cta" className="reveal-up stagger-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-deep transition-all duration-200 green-glow hover:shadow-green-glow-lg text-sm"
              >
                Get Started
                <Icon name="ArrowRightIcon" size={16} className="text-primary-foreground" />
              </Link>
              <Link
                href="#product-demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-secondary transition-all duration-200 card-shadow text-sm"
              >
                <Icon name="PlayCircleIcon" size={16} className="text-primary" />
                See how it works
              </Link>
            </div>

            {/* Trust line */}
            <p className="reveal-up stagger-3 text-sm text-muted-foreground">
              Built for service businesses that don&apos;t have time to chase every detail.
            </p>
          </div>

          {/* Right: Product Visual */}
          <div className="relative reveal-scale stagger-2">
            <div className="relative">
              {/* Main composition card */}
              <div className="bg-card border border-border rounded-3xl card-shadow-xl p-4 float-animation">
                <div className="grid grid-cols-2 gap-3">
                  {/* Chat panel */}
                  <div className="bg-background rounded-2xl p-3 border border-border">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name="ChatBubbleLeftRightIcon" size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Client Chat</p>
                        <p className="text-[10px] text-muted-foreground">via WhatsApp</p>
                      </div>
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div ref={messagesRef} className="space-y-2">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`chat-msg flex ${msg.from === 'client' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-[10px] leading-relaxed ${
                              msg.from === 'client' ?'bg-muted text-foreground rounded-tl-sm' :'bg-primary text-primary-foreground rounded-tr-sm'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right column: Brief + Quote */}
                  <div className="space-y-3">
                    {/* Client Brief */}
                    <div className="bg-background rounded-2xl p-3 border border-border">
                      <p className="text-[10px] font-semibold text-foreground mb-2 flex items-center gap-1">
                        <Icon name="DocumentTextIcon" size={12} className="text-primary" />
                        Client Brief
                      </p>
                      <div className="space-y-1.5">
                        {briefItems.map((item) => (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="text-[9px] text-muted-foreground">{item.label}</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-[9px] font-medium ${item.status === 'done' ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {item.value}
                              </span>
                              {item.status === 'done' ? (
                                <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                                  <Icon name="CheckIcon" size={8} className="text-primary-foreground" />
                                </div>
                              ) : (
                                <div className="w-3 h-3 rounded-full bg-muted border border-border" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Draft Quote */}
                    <div className="bg-primary rounded-2xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-semibold text-primary-foreground">Draft Quote</p>
                        <span className="text-[9px] bg-white/20 text-primary-foreground px-1.5 py-0.5 rounded-full">Ready</span>
                      </div>
                      <p className="text-xl font-bold text-primary-foreground leading-none mb-1">₦507,000</p>
                      <p className="text-[9px] text-primary-foreground/70 mb-3">Catering for 120 · Ikeja</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button className="bg-white/20 text-primary-foreground text-[9px] font-medium py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                          Edit
                        </button>
                        <button className="bg-white text-primary text-[9px] font-semibold py-1.5 rounded-lg hover:bg-primary-soft transition-colors">
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent cards */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-3 py-2 card-shadow float-animation-delayed hidden lg:flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="BoltIcon" size={12} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-foreground">Quote ready</p>
                  <p className="text-[9px] text-muted-foreground">in 23 seconds</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-3 py-2 card-shadow float-animation-slow hidden lg:flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Icon name="CheckIcon" size={12} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-foreground">You approved</p>
                  <p className="text-[9px] text-muted-foreground">Quote sent ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}