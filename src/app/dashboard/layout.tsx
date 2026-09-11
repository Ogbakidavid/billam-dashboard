'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import SearchOverlay from '@/app/dashboard/components/SearchOverlay';
import NotificationPanel from '@/app/dashboard/components/NotificationPanel';
import { PersonaProvider, usePersona, PersonaKey } from '@/app/dashboard/context/PersonaContext';

const navItems = [
  { label: 'Overview',        href: '/dashboard',          icon: 'Squares2X2Icon' },
  { label: 'Jobs',            href: '/dashboard/jobs',      icon: 'BriefcaseIcon' },
  { label: 'Quotes',          href: '/dashboard/quotes',    icon: 'DocumentTextIcon' },
  { label: 'Clients',         href: '/dashboard/clients',   icon: 'UsersIcon' },
  { label: 'Activity',        href: '/dashboard/activity',  icon: 'ClockIcon' },
  { label: 'Chat Simulator',  href: '/dashboard/chat',      icon: 'ChatBubbleLeftRightIcon' },
];

const bottomNavItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: 'Cog6ToothIcon' },
];

function PersonaSwitcher() {
  const { currentPersona, setPersona, allPersonas } = usePersona();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F0FFF6] border border-[#19D66B]/30 rounded-xl text-[12px] font-semibold text-[#079A4F] hover:bg-[#DDFBEA] transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-[#19D66B] shrink-0" />
        <span className="hidden sm:inline truncate max-w-[120px]">{currentPersona.label}</span>
        <Icon name="ChevronDownIcon" size={12} className={`transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 sm:left-0 mt-2 w-52 bg-white border border-[#E7E7E3] rounded-[16px] py-1.5 z-50"
          style={{ boxShadow: '0 4px 6px rgba(20,25,20,0.04), 0 12px 40px rgba(20,25,20,0.10)' }}
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">Demo Persona</p>
          {allPersonas.map(p => (
            <button
              key={p.key}
              onClick={() => { setPersona(p.key as PersonaKey); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${
                currentPersona.key === p.key
                  ? 'text-[#079A4F] font-semibold bg-[#F0FFF6]'
                  : 'text-[#171817] hover:bg-[#FAFAF9]'
              }`}
            >
              {currentPersona.key === p.key
                ? <Icon name="CheckIcon" size={13} className="text-[#19D66B]" />
                : <span className="w-3.5 h-3.5" />
              }
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentPersona } = usePersona();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href);
  };

  const initials = currentPersona.businessName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F5F5F3' }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`shrink-0 z-50 lg:z-auto flex flex-col transition-transform duration-300 fixed lg:relative overflow-visible ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: 220, alignSelf: 'flex-start', paddingTop: '12px', paddingBottom: '12px' }}
      >
        <div
          className="flex flex-col bg-white border border-[#E7E7E3] py-4 px-3 gap-2 overflow-visible"
          style={{
            boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)',
            borderRadius: 20,
            height: 823,
            maxHeight: 'calc(100vh - 24px)',
          }}
        >
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-2 pb-3 border-b border-[#E7E7E3] px-1">
            <div
              className="w-10 h-10 rounded-[14px] bg-[#19D66B] flex items-center justify-center shrink-0"
              style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 16px rgba(25,214,107,0.2)' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V13C19 14.1 18.1 15 17 15H12L8 19V15H5C3.9 15 3 14.1 3 13V4Z" fill="white" fillOpacity="0.9"/>
                <path d="M11 6L11.8 8.2L14 9L11.8 9.8L11 12L10.2 9.8L8 9L10.2 8.2L11 6Z" fill="#19D66B"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold text-[#171817] tracking-tight">BillAm</span>
          </div>

          {/* Main nav */}
          <nav className="flex flex-col gap-0.5 flex-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-[14px] transition-all duration-150 ${
                    active
                      ? 'bg-[#DDFBEA] text-[#19D66B]'
                      : 'text-[#6F716E] hover:bg-[#F0F0EE] hover:text-[#171817]'
                  }`}
                >
                  <Icon name={item.icon} size={18} className={`shrink-0 ${active ? 'text-[#19D66B]' : ''}`} />
                  <span className={`text-[13px] font-semibold truncate ${active ? 'text-[#19D66B]' : ''}`}>{item.label}</span>
                  {active && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[1px] w-1 h-5 bg-[#19D66B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom nav */}
          <div className="flex flex-col gap-0.5 pt-3 border-t border-[#E7E7E3]">
            {bottomNavItems.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-[14px] transition-all duration-150 ${
                    active
                      ? 'bg-[#DDFBEA] text-[#19D66B]'
                      : 'text-[#6F716E] hover:bg-[#F0F0EE] hover:text-[#171817]'
                  }`}
                >
                  <Icon name={item.icon} size={18} className={`shrink-0 ${active ? 'text-[#19D66B]' : ''}`} />
                  <span className={`text-[13px] font-semibold truncate ${active ? 'text-[#19D66B]' : ''}`}>{item.label}</span>
                  {active && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[1px] w-1 h-5 bg-[#19D66B] rounded-full" />
                  )}
                </Link>
              );
            })}
            {/* Avatar row */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] cursor-pointer hover:bg-[#F0F0EE] transition-colors mt-1">
              <div className="w-8 h-8 rounded-[10px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
                <span className="text-[#079A4F] font-bold text-xs">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#171817] truncate">{currentPersona.businessName}</p>
                <p className="text-[10px] text-[#999C98] truncate">Account</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden gap-0 p-3 sm:p-3">
        {/* Top header — constrained to match content width, with rounded corners */}
        <header
          className="flex items-center justify-between px-4 sm:px-5 py-3 bg-white border border-[#E7E7E3] shrink-0 mb-0"
          style={{
            boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)',
            borderRadius: 20,
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors shrink-0"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Icon name="Bars3Icon" size={20} className="text-[#171817]" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[14px] sm:text-[16px] font-bold text-[#171817] leading-tight truncate">
                Good morning, <span className="text-[#19D66B]">{currentPersona.businessName}</span>
              </h1>
              <p className="hidden sm:block text-[11px] text-[#6F716E] mt-0.5">Here&apos;s what needs your attention today.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Persona switcher */}
            <PersonaSwitcher />

            {/* Date pill */}
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E7E7E3] rounded-xl text-xs text-[#6F716E]"
              style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
            >
              <Icon name="CalendarDaysIcon" size={13} />
              <span>01 Sep 2026</span>
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E] hover:text-[#171817]"
              title="Search"
            >
              <Icon name="MagnifyingGlassIcon" size={18} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E] hover:text-[#171817]"
                title="Notifications"
              >
                <Icon name="BellIcon" size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#19D66B] rounded-full border-2 border-white" />
              </button>
              {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl bg-[#DDFBEA] flex items-center justify-center cursor-pointer hover:bg-[#19D66B]/20 transition-colors">
              <span className="text-[#079A4F] font-bold text-xs">{initials}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto mt-3">
          {children}
        </main>
      </div>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PersonaProvider>
      <DashboardShell>{children}</DashboardShell>
    </PersonaProvider>
  );
}
