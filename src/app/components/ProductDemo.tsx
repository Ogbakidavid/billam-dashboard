'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Message {
  from: 'client' | 'billam';
  text: string;
  delay: number;
}

const demoMessages: Message[] = [
  { from: 'client', text: 'I need catering for 120 people next Saturday in Ikeja.', delay: 0 },
  { from: 'billam', text: 'Got it! I\'ve captured the key details. Is this an indoor or outdoor event?', delay: 1200 },
  { from: 'client', text: 'Indoor. It\'s a birthday party.', delay: 2400 },
  { from: 'billam', text: 'Perfect. What\'s your approximate budget range for the catering?', delay: 3600 },
  { from: 'client', text: 'Around ₦350,000.', delay: 4800 },
  { from: 'billam', text: 'Thanks! I\'ve built a draft quote based on your details. Please review.', delay: 6000 },
];

const briefProgression = [
  { label: 'Event Type', value: 'Birthday Party', step: 2 },
  { label: 'Guests', value: '120 people', step: 0 },
  { label: 'Location', value: 'Ikeja, Lagos', step: 0 },
  { label: 'Date', value: 'Next Saturday', step: 0 },
  { label: 'Budget', value: '₦350,000', step: 4 },
];

export default function ProductDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [briefItems, setBriefItems] = useState<number>(3);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const runDemo = () => {
    clearAllTimeouts();
    setVisibleMessages(0);
    setBriefItems(3);
    setQuoteVisible(false);
    setIsPlaying(true);

    demoMessages.forEach((msg, i) => {
      const t = setTimeout(() => {
        setVisibleMessages(i + 1);
        if (i === 1) setBriefItems(4);
        if (i === 4) setBriefItems(5);
        if (i === 5) setQuoteVisible(true);
        if (i === demoMessages.length - 1) setIsPlaying(false);
      }, msg.delay + 300);
      timeoutsRef.current.push(t);
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isPlaying && visibleMessages === 0) {
          runDemo();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { observer.disconnect(); clearAllTimeouts(); };
  }, []);

  return (
    <section id="product-demo" className="py-20 px-4 bg-card border-y border-border" ref={sectionRef} aria-labelledby="demo-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">Live Demo</span>
          <h2 id="demo-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            Watch a conversation become a quote.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            See exactly how BillAm handles a real client intake from first message to draft quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Chat */}
          <div className="bg-background border border-border rounded-2xl overflow-hidden card-shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-foreground">Client Conversation</span>
              </div>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">WhatsApp</span>
            </div>
            <div className="p-4 space-y-3 min-h-[320px]">
              {demoMessages.slice(0, visibleMessages).map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'client' ? 'justify-start' : 'justify-end'} chat-bubble-in`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.from === 'client' ?'bg-muted text-foreground rounded-tl-sm' :'bg-primary text-primary-foreground rounded-tr-sm'
                  }`}>
                    {msg.from === 'billam' && (
                      <p className="text-[9px] font-bold text-primary-foreground/70 mb-0.5 uppercase tracking-wide">BillAm</p>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isPlaying && visibleMessages < demoMessages.length && (
                <div className="flex justify-end">
                  <div className="bg-primary/20 px-3 py-2 rounded-xl flex items-center gap-1">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="w-1.5 h-1.5 rounded-full bg-primary typing-dots"
                        style={{ animationDelay: `${dot * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Brief Extraction */}
          <div className="bg-background border border-border rounded-2xl overflow-hidden card-shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <Icon name="DocumentTextIcon" size={14} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">Brief Extraction</span>
              </div>
              <span className="text-[10px] text-primary bg-primary-soft px-2 py-0.5 rounded-full font-medium">Live</span>
            </div>
            <div className="p-4 space-y-2 min-h-[320px]">
              <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wide font-medium">Detected fields</p>
              {briefProgression.slice(0, briefItems).map((item, i) => (
                <div key={item.label} className="flex items-center justify-between p-2.5 bg-card border border-border rounded-xl chat-bubble-in">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{item.value}</span>
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="CheckIcon" size={10} className="text-primary-foreground" />
                    </div>
                  </div>
                </div>
              ))}
              {briefItems < briefProgression.length && (
                <div className="flex items-center justify-between p-2.5 bg-muted border border-dashed border-border rounded-xl">
                  <span className="text-xs text-muted-foreground">Budget</span>
                  <span className="text-[10px] text-muted-foreground italic">Asking client...</span>
                </div>
              )}
            </div>
          </div>

          {/* Quote */}
          <div className="bg-background border border-border rounded-2xl overflow-hidden card-shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <Icon name="CurrencyDollarIcon" size={14} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">Generated Quote</span>
              </div>
              {quoteVisible && (
                <span className="text-[10px] text-primary bg-primary-soft px-2 py-0.5 rounded-full font-medium">Ready</span>
              )}
            </div>
            <div className="p-4 min-h-[320px]">
              {quoteVisible ? (
                <div className="chat-bubble-in space-y-3">
                  <div className="bg-primary rounded-2xl p-4">
                    <p className="text-[10px] text-primary-foreground/70 uppercase tracking-wide mb-1">Total Estimate</p>
                    <p className="text-3xl font-bold text-primary-foreground">₦507,000</p>
                    <p className="text-xs text-primary-foreground/70 mt-1">Catering · 120 guests · Ikeja</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { item: 'Food & Beverages', cost: '₦320,000' },
                      { item: 'Service Staff (8)', cost: '₦96,000' },
                      { item: 'Equipment Rental', cost: '₦56,000' },
                      { item: 'Setup & Logistics', cost: '₦35,000' },
                    ].map((line) => (
                      <div key={line.item} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                        <span className="text-xs text-muted-foreground">{line.item}</span>
                        <span className="text-xs font-semibold text-foreground">{line.cost}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button className="py-2.5 bg-muted border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-secondary transition-colors">
                      Edit Quote
                    </button>
                    <button className="py-2.5 bg-primary rounded-xl text-xs font-semibold text-primary-foreground hover:bg-primary-deep transition-colors">
                      Approve & Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                    <Icon name="DocumentTextIcon" size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Quote will appear here once brief is complete</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Replay */}
        <div className="text-center mt-8">
          <button
            onClick={runDemo}
            disabled={isPlaying}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed card-shadow"
          >
            <Icon name="ArrowPathIcon" size={16} className="text-primary" />
            {isPlaying ? 'Running demo...' : 'Replay demo'}
          </button>
        </div>
      </div>
    </section>
  );
}