import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Solutions: [
    { label: 'Caterers', href: '#use-cases' },
    { label: 'Decorators', href: '#use-cases' },
    { label: 'Tailors', href: '#use-cases' },
    { label: 'Photographers', href: '#use-cases' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Resources: [
    { label: 'Blog', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Documentation', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <AppLogo size={32} />
              <span className="font-bold text-lg text-foreground tracking-tight">BillAm</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered client intake and quotation for service businesses that move fast.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Now in early access</span>
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks)?.map(([group, links]) => (
            <div key={group} className="space-y-3">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{group}</h4>
              <ul className="space-y-2">
                {links?.map((link) => (
                  <li key={link?.label}>
                    <Link
                      href={link?.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 BillAm. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}