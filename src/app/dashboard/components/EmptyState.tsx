'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F0F0EE] flex items-center justify-center mb-4">
        <Icon name={icon} size={28} className="text-[#999C98]" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#171817] mb-1">{title}</h3>
      <p className="text-sm text-[#6F716E] max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 bg-[#19D66B] text-white text-sm font-semibold rounded-xl hover:bg-[#079A4F] transition-colors"
          style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
