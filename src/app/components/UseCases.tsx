import React from 'react';
import Icon from '@/components/ui/AppIcon';

const useCases = [
  {
    icon: 'FireIcon',
    title: 'Event Caterers',
    desc: 'Capture guest counts, menus, dietary requirements, and venue details automatically.',
    example: 'Client: "120 guests, buffet style, no pork" → Quote in 90 seconds',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: 'SparklesIcon',
    title: 'Decorators',
    desc: 'Gather event type, theme, venue dimensions, and budget before you even pick up the phone.',
    example: 'Client: "Garden wedding, rustic theme" → Structured brief instantly',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: 'ScissorsIcon',
    title: 'Tailors',
    desc: 'Collect measurements, fabric preferences, occasion, and delivery timeline from every client.',
    example: 'Client: "Navy suit for interview" → Brief + quote ready',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: 'CameraIcon',
    title: 'Photographers',
    desc: 'Understand shoot type, duration, location, and deliverables without back-and-forth emails.',
    example: 'Client: "Wedding photos, 6 hours" → Package quote generated',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: 'TruckIcon',
    title: 'Rental Businesses',
    desc: 'Capture item lists, dates, quantities, and delivery requirements from every inquiry.',
    example: 'Client: "10 tables, 80 chairs, Saturday" → Availability + quote',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: 'CalendarDaysIcon',
    title: 'Event Planners',
    desc: 'Manage complex multi-vendor briefs and generate consolidated quotes for full-service events.',
    example: 'Client: "Corporate dinner, 200 guests" → Full scope brief',
    color: 'bg-green-50 text-green-600',
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-20 px-4" aria-labelledby="usecases-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal-up">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">Solutions</span>
          <h2 id="usecases-heading" className="text-section font-bold text-foreground tracking-tight mb-4">
            Built for service businesses.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            If your business quotes services to clients, BillAm was made for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc, i) => (
            <div
              key={uc.title}
              className={`reveal-up bg-card border border-border rounded-3xl p-6 card-shadow hover:card-shadow-lg transition-all duration-300 group stagger-${(i % 3) + 1}`}
            >
              <div className={`w-10 h-10 rounded-2xl ${uc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={uc.icon as 'FireIcon'} size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{uc.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{uc.desc}</p>
              <div className="bg-background border border-border rounded-xl p-3">
                <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">{uc.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}