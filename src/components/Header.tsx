'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { label: 'Product', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Solutions', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#faq' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={`w-full max-w-5xl bg-card border border-border rounded-2xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'card-shadow-lg' : 'card-shadow'
          }`}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="BillAm home">
            <AppLogo size={32} />
            <span className="font-bold text-lg text-foreground tracking-tight">BillAm</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks?.map((link) => (
              <Link
                key={link?.label}
                href={link?.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors duration-150"
              >
                {link?.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors duration-150"
            >
              Dashboard
            </Link>
            <Link
              href="#hero-cta"
              className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary-deep transition-colors duration-150 green-glow"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="#hero-cta"
              className="px-3 py-2 text-xs font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary-deep transition-colors"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} className="text-foreground" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-20 left-4 right-4 z-50 bg-card border border-border rounded-2xl card-shadow-lg p-4 md:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-1">
          {navLinks?.map((link) => (
            <Link
              key={link?.label}
              href={link?.href}
              onClick={handleNavClick}
              className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors"
            >
              {link?.label}
            </Link>
          ))}
          <div className="border-t border-border mt-2 pt-2 flex flex-col gap-2">
            <Link
              href="#pricing"
              onClick={handleNavClick}
              className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors text-center"
            >
              Log in
            </Link>
            <Link
              href="#hero-cta"
              onClick={handleNavClick}
              className="px-4 py-3 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary-deep transition-colors text-center"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}