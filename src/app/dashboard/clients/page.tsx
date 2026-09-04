'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge, { StatusType } from '@/app/dashboard/components/StatusBadge';
import EmptyState from '@/app/dashboard/components/EmptyState';

const clients = [
  { id: '1', name: 'Sarah Adeyemi',   phone: '+234 801 234 5678', activeJobs: 1, prevJobs: 2, lastInteraction: '2m ago',  latestQuote: '₦507,000', status: 'awaiting_approval' as StatusType },
  { id: '2', name: 'Michael Okoro',   phone: '+234 802 345 6789', activeJobs: 1, prevJobs: 0, lastInteraction: '18m ago', latestQuote: '₦280,000', status: 'needs_input'       as StatusType },
  { id: '3', name: 'David James',     phone: '+234 803 456 7890', activeJobs: 1, prevJobs: 1, lastInteraction: '1h ago',  latestQuote: '₦415,000', status: 'failed'            as StatusType },
  { id: '4', name: 'Amaka Nwosu',     phone: '+234 804 567 8901', activeJobs: 1, prevJobs: 3, lastInteraction: '3h ago',  latestQuote: '₦195,000', status: 'clarifying'        as StatusType },
  { id: '5', name: 'Tunde Bello',     phone: '+234 805 678 9012', activeJobs: 0, prevJobs: 4, lastInteraction: '4h ago',  latestQuote: '₦85,000',  status: 'executed'          as StatusType },
  { id: '6', name: 'Ngozi Okafor',    phone: '+234 806 789 0123', activeJobs: 1, prevJobs: 1, lastInteraction: '6h ago',  latestQuote: '₦320,000', status: 'in_progress'       as StatusType },
  { id: '7', name: 'Emeka Eze',       phone: '+234 807 890 1234', activeJobs: 1, prevJobs: 0, lastInteraction: '8h ago',  latestQuote: '₦650,000', status: 'clarifying'        as StatusType },
  { id: '8', name: 'Fatima Bello',    phone: '+234 808 901 2345', activeJobs: 1, prevJobs: 2, lastInteraction: '12h ago', latestQuote: '₦145,000', status: 'awaiting_approval' as StatusType },
];

const avatarColors = [
  { bg: 'bg-[#DDFBEA]', text: 'text-[#079A4F]' },
  { bg: 'bg-blue-50',   text: 'text-blue-600' },
  { bg: 'bg-amber-50',  text: 'text-amber-600' },
  { bg: 'bg-purple-50', text: 'text-purple-600' },
];

export default function ClientsPage() {
  const [search, setSearch] = useState('');

  const filtered = clients.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#171817]">Clients</h1>
          <p className="text-[12px] text-[#6F716E] mt-0.5">{clients.length} clients</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999C98]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients or phone..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] placeholder:text-[#999C98] outline-hidden focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all"
          style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="UsersIcon"
          title="No Clients Found"
          description="No clients match your search."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((client, idx) => {
            const av = avatarColors[idx % avatarColors.length];
            const initials = client.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
            return (
              <div
                key={client.id}
                className="bg-white border border-[#E7E7E3] rounded-[20px] p-4 hover:shadow-md transition-shadow cursor-pointer group"
                style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
              >
                {/* Avatar + status */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${av.bg}`}>
                    <span className={`font-bold text-sm ${av.text}`}>{initials}</span>
                  </div>
                  <StatusBadge status={client.status} size="sm" />
                </div>

                {/* Name + phone */}
                <h3 className="text-[14px] font-semibold text-[#171817]">{client.name}</h3>
                <p className="text-[12px] text-[#999C98] mt-0.5">{client.phone}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E7E7E3]">
                  <div>
                    <p className="text-[10px] text-[#999C98] uppercase tracking-wider font-semibold">Active</p>
                    <p className="text-[15px] font-bold text-[#171817] mt-0.5">{client.activeJobs}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#999C98] uppercase tracking-wider font-semibold">Previous</p>
                    <p className="text-[15px] font-bold text-[#171817] mt-0.5">{client.prevJobs}</p>
                  </div>
                </div>

                {/* Quote + time */}
                <div className="mt-3 pt-3 border-t border-[#E7E7E3] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#999C98] uppercase tracking-wider font-semibold">Latest quote</p>
                    <p className="text-[13px] font-semibold text-[#171817] mt-0.5">{client.latestQuote}</p>
                  </div>
                  <span className="text-[11px] text-[#999C98]">{client.lastInteraction}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
