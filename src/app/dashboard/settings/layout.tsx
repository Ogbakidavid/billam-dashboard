'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: { label: string; href: string; icon: string }[];
}

const settingsNav: NavItem[] = [
  {
    label: 'Business Profile',
    href: '/dashboard/settings',
    icon: 'BuildingOffice2Icon',
    children: [
      { label: 'Business Information', href: '/dashboard/settings',            icon: 'InformationCircleIcon' },
      { label: 'Knowledge Base',       href: '/dashboard/settings/knowledge',  icon: 'BookOpenIcon' },
      { label: 'Availability',         href: '/dashboard/settings/availability', icon: 'CalendarDaysIcon' },
    ],
  },
  {
    label: 'Account',
    href: '/dashboard/settings/account',
    icon: 'UserCircleIcon',
  },
  {
    label: 'Help',
    href: '/dashboard/settings/help',
    icon: 'QuestionMarkCircleIcon',
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isChildActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((c) => pathname === c.href);
    }
    return pathname === item.href;
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1200px]">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#171817]">Settings</h1>
        <p className="text-[12px] text-[#6F716E] mt-0.5">Manage your business profile, knowledge, and availability</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
        {/* Settings sidebar */}
        <aside className="w-full sm:w-52 shrink-0">
          <div
            className="bg-white border border-[#E7E7E3] rounded-[20px] p-2"
            style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
          >
            <nav className="flex flex-col gap-0.5">
              {settingsNav.map((item) => {
                const groupActive = isGroupActive(item);

                if (item.children) {
                  return (
                    <div key={item.href}>
                      {/* Group header — not a link, just a label */}
                      <div
                        className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[14px] ${
                          groupActive ? 'text-[#19D66B]' : 'text-[#6F716E]'
                        }`}
                      >
                        <Icon name={item.icon} size={16} className="shrink-0" />
                        <span className="text-[12px] font-bold uppercase tracking-wider truncate">
                          {item.label}
                        </span>
                      </div>
                      {/* Children */}
                      <div className="flex flex-col gap-0.5 pl-2 mb-1">
                        {item.children.map((child) => {
                          const active = isChildActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`relative flex items-center gap-2.5 w-full px-3 py-2 rounded-[12px] transition-all duration-150 ${
                                active
                                  ? 'bg-[#DDFBEA] text-[#19D66B]'
                                  : 'text-[#6F716E] hover:bg-[#F0F0EE] hover:text-[#171817]'
                              }`}
                            >
                              <Icon name={child.icon} size={15} className="shrink-0" />
                              <span className={`text-[12px] font-semibold truncate ${active ? 'text-[#19D66B]' : ''}`}>
                                {child.label}
                              </span>
                              {active && (
                                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[1px] w-1 h-4 bg-[#19D66B] rounded-full" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                const active = isChildActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[14px] transition-all duration-150 ${
                      active
                        ? 'bg-[#DDFBEA] text-[#19D66B]'
                        : 'text-[#6F716E] hover:bg-[#F0F0EE] hover:text-[#171817]'
                    }`}
                  >
                    <Icon name={item.icon} size={16} className="shrink-0" />
                    <span className={`text-[13px] font-semibold truncate ${active ? 'text-[#19D66B]' : ''}`}>
                      {item.label}
                    </span>
                    {active && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[1px] w-1 h-5 bg-[#19D66B] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
