'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: string;
  accent?: boolean;
  sub?: string;
  iconBg?: string;
  iconColor?: string;
}

export default function MetricCard({
  label,
  value,
  change,
  changePositive = true,
  icon,
  accent = false,
  sub,
  iconBg,
  iconColor,
}: MetricCardProps) {
  const resolvedIconBg = iconBg ?? (accent ? 'bg-[#DDFBEA]' : 'bg-[#F0F0EE]');
  const resolvedIconColor = iconColor ?? (accent ? 'text-[#19D66B]' : 'text-[#6F716E]');

  return (
    <div
      className={`bg-white border rounded-[20px] p-5 flex flex-col justify-between h-full transition-shadow hover:shadow-md cursor-pointer ${
        accent ? 'border-[#19D66B]/20' : 'border-[#E7E7E3]'
      }`}
      style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#6F716E] uppercase tracking-wider leading-none">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${resolvedIconBg}`}>
          <Icon name={icon} size={16} className={resolvedIconColor} />
        </div>
      </div>

      <div className="mt-3">
        <div
          className={`text-[32px] font-bold tracking-tight leading-none ${
            accent ? 'text-[#19D66B]' : 'text-[#171817]'
          }`}
        >
          {value}
        </div>
        {sub && <p className="text-xs text-[#999C98] mt-1">{sub}</p>}
      </div>

      {change && (
        <div className="flex flex-col gap-0.5 mt-3">
          <div className="flex items-center gap-1.5">
            <Icon
              name={changePositive ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'}
              size={13}
              className={changePositive ? 'text-[#19D66B]' : 'text-red-500'}
            />
            <span
              className={`text-xs font-semibold whitespace-nowrap ${changePositive ? 'text-[#19D66B]' : 'text-red-500'}`}
            >
              {change}
            </span>
          </div>
          <span className="text-xs text-[#999C98]">vs last 30 days</span>
        </div>
      )}
    </div>
  );
}
