'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertBannerProps {
  variant: AlertVariant;
  message: string;
  dismissible?: boolean;
}

const variantConfig: Record<AlertVariant, {
  bg: string;
  border: string;
  text: string;
  icon: string;
  iconColor: string;
}> = {
  success: {
    bg: 'bg-[#F0FFF6]',
    border: 'border-[#19D66B]/30',
    text: 'text-[#079A4F]',
    icon: 'CheckCircleIcon',
    iconColor: 'text-[#19D66B]',
  },
  warning: {
    bg: 'bg-[#FFFBE6]',
    border: 'border-[#FFE58F]',
    text: 'text-[#92400E]',
    icon: 'ExclamationTriangleIcon',
    iconColor: 'text-[#F5B300]',
  },
  error: {
    bg: 'bg-[#FFF1F0]',
    border: 'border-[#FFCCC7]',
    text: 'text-[#991B1B]',
    icon: 'XCircleIcon',
    iconColor: 'text-[#FF4D4F]',
  },
  info: {
    bg: 'bg-[#E6F4FF]',
    border: 'border-[#91CAFF]',
    text: 'text-[#1E40AF]',
    icon: 'InformationCircleIcon',
    iconColor: 'text-[#1677FF]',
  },
};

export default function AlertBanner({ variant, message, dismissible = true }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const cfg = variantConfig[variant];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <Icon name={cfg.icon} size={16} className={cfg.iconColor} />
      <span className="flex-1">{message}</span>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <Icon name="XMarkIcon" size={14} className={cfg.text} />
        </button>
      )}
    </div>
  );
}
