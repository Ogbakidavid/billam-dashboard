'use client';

import React, { useEffect, useRef, useState } from 'react';

const metrics = [
  { value: 12, suffix: '+', label: 'Hours saved every week', sublabel: 'Per business on average', prefix: '' },
  { value: 3400, suffix: '+', label: 'Quotes prepared', sublabel: 'During early access', prefix: '' },
  { value: 8900, suffix: '+', label: 'Client conversations handled', sublabel: 'Across all users', prefix: '' },
  { value: 90, suffix: 's', label: 'Average response time', sublabel: 'From message to draft quote', prefix: '<' },
];

export default function MetricsSection() {
  const [counts, setCounts] = useState(metrics.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun.current) {
          hasRun.current = true;
          metrics.forEach((metric, i) => {
            const duration = 1800;
            const start = performance.now();
            const animate = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              setCounts((prev) => {
                const next = [...prev];
                next[i] = Math.floor(metric.value * ease);
                return next;
              });
              if (progress < 1) requestAnimationFrame(animate);
            };
            setTimeout(() => requestAnimationFrame(animate), i * 150);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 border-y border-border bg-primary"
      aria-label="BillAm metrics"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-10">
          Demo metrics — representative of early access performance
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, i) => (
            <div key={metric.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2 tabular-nums">
                {metric.prefix}{counts[i].toLocaleString()}{metric.suffix}
              </div>
              <p className="text-sm font-semibold text-primary-foreground mb-1">{metric.label}</p>
              <p className="text-xs text-primary-foreground/60">{metric.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}