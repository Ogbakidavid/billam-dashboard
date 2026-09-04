import React from 'react';
import Icon from '@/components/ui/AppIcon';

const testimonials = [
  {
    quote: 'Before BillAm, half our time was spent asking clients for the details they forgot to send. Now we start with a complete brief every single time.',
    name: 'Chidinma Okafor',
    role: 'Owner, Chidi\'s Catering Co.',
    initials: 'CO',
    color: 'bg-primary',
    stars: 5,
  },
  {
    quote: 'I used to spend 40 minutes building every quote. Now BillAm does it in under 2 minutes and I just review and approve. It\'s changed how I run my business.',
    name: 'Emeka Nwosu',
    role: 'Lead Decorator, Emeka Events',
    initials: 'EN',
    color: 'bg-blue-500',
    stars: 5,
  },
  {
    quote: 'The budget gap detection alone is worth it. I used to find out too late that a client\'s budget didn\'t match their expectations. Now I know upfront.',
    name: 'Fatima Abdullahi',
    role: 'Founder, Fatima Photography',
    initials: 'FA',
    color: 'bg-purple-500',
    stars: 5,
  },
  {
    quote: 'My clients love that they get a professional quote so fast. They think I have a whole team. It\'s just me and BillAm.',
    name: 'Tunde Adeyemi',
    role: 'Owner, Tunde\'s Tailoring Studio',
    initials: 'TA',
    color: 'bg-orange-500',
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-4 bg-card border-y border-border" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">Social Proof</span>
          <h2 id="testimonials-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            Service businesses love BillAm.
          </h2>
          <p className="text-sm text-muted-foreground">
            Demo testimonials — representative of real user feedback during early access.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials?.map((t, i) => (
            <div
              key={t?.name}
              className={`reveal-up bg-background border border-border rounded-3xl p-6 card-shadow hover:card-shadow-lg transition-all duration-300 flex flex-col stagger-${i + 1}`}
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t?.stars })?.map((_, si) => (
                  <Icon key={si} name="StarIcon" size={14} variant="solid" className="text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed flex-1 mb-4">
                &ldquo;{t?.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t?.color} flex items-center justify-center shrink-0`}>
                  <span className="text-xs font-bold text-white">{t?.initials}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t?.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t?.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}