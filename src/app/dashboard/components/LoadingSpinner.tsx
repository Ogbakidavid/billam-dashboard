'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizeMap = { sm: 20, md: 32, lg: 48 };
  const px = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className="rounded-full border-2 border-[#E7E7E3] border-t-[#19D66B] animate-spinner"
        style={{ width: px, height: px }}
      />
      {label && <p className="text-sm text-[#6F716E]">{label}</p>}
    </div>
  );
}

interface SkeletonProps {
  lines?: number;
  className?: string;
}

export function SkeletonBlock({ lines = 3, className = '' }: SkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded-lg"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
