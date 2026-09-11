'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { JobState, QuoteStatus, BusinessType, AuditEvent } from '@/app/dashboard/types';
import { getJobs } from '@/lib/api';

export type PersonaKey = 'event_decoration' | 'photography' | 'tailoring' | 'catering' | 'event_planning' | 'equipment_rental';

export interface PersonaData {
  key: PersonaKey;
  label: string;
  businessName: string;
  business_type: BusinessType;
  services: string[];
  attentionItems: AttentionItem[];
  recentJobs: RecentJob[];
  allJobs: Job[];
  quotes: Quote[];
  kpis: KPI[];
  auditEvents: AuditEvent[];
}

export interface AttentionItem {
  /** UUID-compatible string ID */
  id: string;
  client: string;
  job: string;
  summary: string;
  detail: string;
  /** Canonical JobState */
  state: JobState;
  /** Numeric NGN amount — format at render time */
  amount: number;
  lastActivity: string;
  action: string;
}

export interface RecentJob {
  /** UUID-compatible string ID */
  id: string;
  client: string;
  job: string;
  /** Canonical JobState */
  state: JobState;
  /** Numeric NGN amount */
  amount: number;
  updated: string;
}

export interface Job {
  /** UUID-compatible string ID */
  id: string;
  client: string;
  phone: string;
  job: string;
  service: string;
  /** Canonical JobState */
  state: JobState;
  /** Numeric NGN amount */
  amount: number;
  lastActivity: string;
  updated: string;
}

export interface Quote {
  /** UUID-compatible string ID */
  id: string;
  client: string;
  event: string;
  /** Numeric NGN amount */
  amount: number;
  status: QuoteStatus;
  created: string;
  updated: string;
}

export interface KPI {
  label: string;
  value: number;
  change: string;
  changePositive: boolean;
  icon: string;
  accent?: boolean;
  iconBg?: string;
  iconColor?: string;
}

const personaData: Record<PersonaKey, PersonaData> = {
  event_decoration: {
    key: 'event_decoration',
    label: 'Event Decoration',
    businessName: 'Stellar Decor',
    business_type: 'event_vendor',
    services: ['Full Venue Decoration', 'Stage & Backdrop', 'Table Styling', 'Lighting', 'Floral Decoration', 'Entrance Decor'],
    kpis: [
      { label: 'Active Jobs', value: 18, change: '+6.2%', changePositive: true, icon: 'BriefcaseIcon' },
      { label: 'Needs Your Input', value: 4, change: '+2 this week', changePositive: false, icon: 'ExclamationCircleIcon', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
      { label: 'Awaiting Approval', value: 6, change: '+2', changePositive: true, icon: 'ClockIcon', accent: true },
      { label: 'In Progress', value: 8, change: '+3.1%', changePositive: true, icon: 'ArrowPathIcon' },
      { label: 'Completed', value: 34, change: '+9.4%', changePositive: true, icon: 'CheckCircleIcon', iconBg: 'bg-[#DDFBEA]', iconColor: 'text-[#19D66B]' },
    ],
    attentionItems: [
      { id: 'ed-job-001', client: 'Adaeze Okonkwo', job: 'Wedding Decoration', summary: '300 guests · Lekki', detail: 'Quote ready for review', state: 'AWAITING_HUMAN_APPROVAL', amount: 850000, lastActivity: '2m ago', action: 'Review Quote' },
      { id: 'ed-job-002', client: 'Bola Fashola', job: 'Corporate Event Decoration', summary: 'Victoria Island', detail: 'Missing venue floor plan', state: 'NEEDS_SME_INPUT', amount: 420000, lastActivity: '15m ago', action: 'Resolve' },
      { id: 'ed-job-003', client: 'Chioma Obi', job: 'Birthday Styling', summary: 'Ikeja · Budget constraint', detail: 'Scope exceeds budget', state: 'FAILED_RETRY', amount: 310000, lastActivity: '1h ago', action: 'Review Issue' },
      { id: 'ed-job-004', client: 'Damilola Ade', job: 'Traditional Ceremony Decor', summary: '150 guests · Yaba', detail: 'Clarification sent, waiting for client', state: 'CLARIFYING', amount: 280000, lastActivity: '3h ago', action: 'View' },
    ],
    recentJobs: [
      { id: 'ed-job-005', client: 'Emeka Nwosu', job: 'Wedding Decor — Full Venue', state: 'EXECUTED', amount: 920000, updated: '4h ago' },
      { id: 'ed-job-006', client: 'Funke Akindele', job: 'Corporate Launch Decor', state: 'REASONING', amount: 540000, updated: '6h ago' },
      { id: 'ed-job-007', client: 'Gbenga Olatunji', job: 'Birthday Setup — Surulere', state: 'CLARIFYING', amount: 195000, updated: '8h ago' },
      { id: 'ed-job-008', client: 'Halima Bello', job: 'Traditional Ceremony Decor', state: 'AWAITING_HUMAN_APPROVAL', amount: 380000, updated: '12h ago' },
    ],
    allJobs: [
      { id: 'ed-job-001', client: 'Adaeze Okonkwo', phone: '+234 801 234 5678', job: 'Wedding Decoration', service: 'Full Venue Decoration', state: 'AWAITING_HUMAN_APPROVAL', amount: 850000, lastActivity: '2m ago', updated: 'Sep 1, 2026' },
      { id: 'ed-job-002', client: 'Bola Fashola', phone: '+234 802 345 6789', job: 'Corporate Event Decoration', service: 'Stage & Backdrop', state: 'NEEDS_SME_INPUT', amount: 420000, lastActivity: '15m ago', updated: 'Sep 1, 2026' },
      { id: 'ed-job-003', client: 'Chioma Obi', phone: '+234 803 456 7890', job: 'Birthday Styling', service: 'Table Styling', state: 'FAILED_RETRY', amount: 310000, lastActivity: '1h ago', updated: 'Aug 31, 2026' },
      { id: 'ed-job-004', client: 'Damilola Ade', phone: '+234 804 567 8901', job: 'Traditional Ceremony Decor', service: 'Floral Decoration', state: 'CLARIFYING', amount: 280000, lastActivity: '3h ago', updated: 'Aug 31, 2026' },
      { id: 'ed-job-005', client: 'Emeka Nwosu', phone: '+234 805 678 9012', job: 'Wedding Decor — Full Venue', service: 'Full Venue Decoration', state: 'EXECUTED', amount: 920000, lastActivity: '4h ago', updated: 'Aug 31, 2026' },
      { id: 'ed-job-006', client: 'Funke Akindele', phone: '+234 806 789 0123', job: 'Corporate Launch Decor', service: 'Lighting', state: 'REASONING', amount: 540000, lastActivity: '6h ago', updated: 'Aug 30, 2026' },
      { id: 'ed-job-007', client: 'Gbenga Olatunji', phone: '+234 807 890 1234', job: 'Birthday Setup', service: 'Entrance Decor', state: 'CLARIFYING', amount: 195000, lastActivity: '8h ago', updated: 'Aug 30, 2026' },
      { id: 'ed-job-008', client: 'Halima Bello', phone: '+234 808 901 2345', job: 'Traditional Ceremony Decor', service: 'Floral Decoration', state: 'AWAITING_HUMAN_APPROVAL', amount: 380000, lastActivity: '12h ago', updated: 'Aug 29, 2026' },
    ],
    quotes: [
      { id: 'qt-ed-001', client: 'Adaeze Okonkwo', event: 'Wedding Decoration', amount: 850000, status: 'awaiting_approval', created: 'Sep 1, 2026', updated: '2m ago' },
      { id: 'qt-ed-002', client: 'Halima Bello', event: 'Traditional Ceremony Decor', amount: 380000, status: 'awaiting_approval', created: 'Aug 29, 2026', updated: '12h ago' },
      { id: 'qt-ed-003', client: 'Emeka Nwosu', event: 'Wedding Decor — Full Venue', amount: 920000, status: 'sent', created: 'Aug 27, 2026', updated: '4h ago' },
      { id: 'qt-ed-004', client: 'Damilola Ade', event: 'Traditional Ceremony Decor', amount: 280000, status: 'draft', created: 'Aug 31, 2026', updated: '3h ago' },
      { id: 'qt-ed-005', client: 'Gbenga Olatunji', event: 'Birthday Setup', amount: 195000, status: 'draft', created: 'Aug 30, 2026', updated: '8h ago' },
      { id: 'qt-ed-003', client: 'Chuks Nwosu', event: 'Corporate Launch', amount: 850000, status: 'awaiting_approval', created: 'Aug 29, 2026', updated: '1d ago' },
    ],
    auditEvents: [],
  },
  photography: {
    key: 'photography',
    label: 'Photography',
    businessName: 'Lens & Light Studio',
    business_type: 'photographer',
    services: ['Wedding Photography', 'Portrait Sessions', 'Corporate Events', 'Product Photography', 'Graduation Shoots', 'Videography'],
    kpis: [
      { label: 'Active Jobs', value: 12, change: '+4.1%', changePositive: true, icon: 'BriefcaseIcon' },
      { label: 'Needs Your Input', value: 3, change: '+1 this week', changePositive: false, icon: 'ExclamationCircleIcon', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
      { label: 'Awaiting Approval', value: 4, change: '+1', changePositive: true, icon: 'ClockIcon', accent: true },
      { label: 'In Progress', value: 5, change: '+2.0%', changePositive: true, icon: 'ArrowPathIcon' },
      { label: 'Completed', value: 28, change: '+7.2%', changePositive: true, icon: 'CheckCircleIcon', iconBg: 'bg-[#DDFBEA]', iconColor: 'text-[#19D66B]' },
    ],
    attentionItems: [
      { id: 'ph-job-001', client: 'Ngozi Okafor', job: 'Wedding Photography', summary: '2 photographers · Lekki', detail: 'Quote ready for review', state: 'AWAITING_HUMAN_APPROVAL', amount: 320000, lastActivity: '5m ago', action: 'Review Quote' },
      { id: 'ph-job-002', client: 'Temi Lawson', job: 'Corporate Event Coverage', summary: 'Victoria Island', detail: 'Missing event schedule', state: 'NEEDS_SME_INPUT', amount: 180000, lastActivity: '22m ago', action: 'Resolve' },
      { id: 'ph-job-003', client: 'Kola Adesanya', job: 'Product Photography', summary: 'Studio · Budget constraint', detail: 'Scope exceeds budget', state: 'FAILED_RETRY', amount: 95000, lastActivity: '2h ago', action: 'Review Issue' },
      { id: 'ph-job-004', client: 'Yetunde Adeyemi', job: 'Graduation Shoot', summary: 'Yaba · 3 outfits', detail: 'Clarification sent, waiting for client', state: 'CLARIFYING', amount: 75000, lastActivity: '4h ago', action: 'View' },
    ],
    recentJobs: [
      { id: 'ph-job-005', client: 'Seun Kuti', job: 'Wedding Photography', state: 'EXECUTED', amount: 450000, updated: '3h ago' },
      { id: 'ph-job-006', client: 'Amara Eze', job: 'Portrait Session', state: 'REASONING', amount: 65000, updated: '5h ago' },
      { id: 'ph-job-007', client: 'Biodun Olatunji', job: 'Corporate Event Coverage', state: 'CLARIFYING', amount: 220000, updated: '7h ago' },
      { id: 'ph-job-008', client: 'Chiamaka Nwosu', job: 'Graduation Shoot', state: 'AWAITING_HUMAN_APPROVAL', amount: 85000, updated: '10h ago' },
    ],
    allJobs: [
      { id: 'ph-job-001', client: 'Ngozi Okafor', phone: '+234 801 234 5678', job: 'Wedding Photography', service: 'Wedding Photography', state: 'AWAITING_HUMAN_APPROVAL', amount: 320000, lastActivity: '5m ago', updated: 'Sep 1, 2026' },
      { id: 'ph-job-002', client: 'Temi Lawson', phone: '+234 802 345 6789', job: 'Corporate Event Coverage', service: 'Corporate Events', state: 'NEEDS_SME_INPUT', amount: 180000, lastActivity: '22m ago', updated: 'Sep 1, 2026' },
      { id: 'ph-job-003', client: 'Kola Adesanya', phone: '+234 803 456 7890', job: 'Product Photography', service: 'Product Photography', state: 'FAILED_RETRY', amount: 95000, lastActivity: '2h ago', updated: 'Aug 31, 2026' },
      { id: 'ph-job-004', client: 'Yetunde Adeyemi', phone: '+234 804 567 8901', job: 'Graduation Shoot', service: 'Graduation Shoots', state: 'CLARIFYING', amount: 75000, lastActivity: '4h ago', updated: 'Aug 31, 2026' },
      { id: 'ph-job-005', client: 'Seun Kuti', phone: '+234 805 678 9012', job: 'Wedding Photography', service: 'Wedding Photography', state: 'EXECUTED', amount: 450000, lastActivity: '3h ago', updated: 'Aug 31, 2026' },
      { id: 'ph-job-006', client: 'Amara Eze', phone: '+234 806 789 0123', job: 'Portrait Session', service: 'Portrait Sessions', state: 'REASONING', amount: 65000, lastActivity: '5h ago', updated: 'Aug 30, 2026' },
    ],
    quotes: [
      { id: 'qt-ph-001', client: 'Ngozi Okafor', event: 'Wedding Photography', amount: 320000, status: 'awaiting_approval', created: 'Sep 1, 2026', updated: '5m ago' },
      { id: 'qt-ph-002', client: 'Chiamaka Nwosu', event: 'Graduation Shoot', amount: 85000, status: 'awaiting_approval', created: 'Aug 29, 2026', updated: '10h ago' },
      { id: 'qt-ph-003', client: 'Seun Kuti', event: 'Wedding Photography', amount: 450000, status: 'sent', created: 'Aug 27, 2026', updated: '3h ago' },
      { id: 'qt-ph-002', client: 'Zainab Bello', event: 'Pre-wedding Shoot', amount: 150000, status: 'draft', created: 'Aug 30, 2026', updated: '5h ago' },
    ],
    auditEvents: [],
  },
  tailoring: {
    key: 'tailoring',
    label: 'Bespoke Tailoring',
    businessName: 'Prestige Tailors',
    business_type: 'tailor',
    services: ['Bespoke Suits', 'Traditional Attire', 'Wedding Outfits', 'Corporate Uniforms', 'Alterations', 'Fabric Sourcing'],
    kpis: [
      { label: 'Active Jobs', value: 22, change: '+5.8%', changePositive: true, icon: 'BriefcaseIcon' },
      { label: 'Needs Your Input', value: 6, change: '+3 this week', changePositive: false, icon: 'ExclamationCircleIcon', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
      { label: 'Awaiting Approval', value: 5, change: '+2', changePositive: true, icon: 'ClockIcon', accent: true },
      { label: 'In Progress', value: 11, change: '+4.5%', changePositive: true, icon: 'ArrowPathIcon' },
      { label: 'Completed', value: 52, change: '+11.3%', changePositive: true, icon: 'CheckCircleIcon', iconBg: 'bg-[#DDFBEA]', iconColor: 'text-[#19D66B]' },
    ],
    attentionItems: [
      { id: 'tl-job-001', client: 'Tunde Bello', job: 'Bespoke Suits — 3 pieces', summary: 'Surulere · Measurements taken', detail: 'Quote ready for review', state: 'AWAITING_HUMAN_APPROVAL', amount: 185000, lastActivity: '4m ago', action: 'Review Quote' },
      { id: 'tl-job-002', client: 'Ola Martins', job: 'Traditional Agbada Set', summary: 'Ikeja · Missing fabric choice', detail: 'Awaiting fabric selection', state: 'NEEDS_SME_INPUT', amount: 95000, lastActivity: '30m ago', action: 'Resolve' },
      { id: 'tl-job-003', client: 'Chukwu Eze', job: 'Wedding Outfit — Groom', summary: 'Lekki · Budget constraint', detail: 'Scope exceeds budget', state: 'FAILED_RETRY', amount: 220000, lastActivity: '2h ago', action: 'Review Issue' },
      { id: 'tl-job-004', client: 'Sade Adu', job: 'Corporate Uniforms x10', summary: 'Victoria Island · 10 pieces', detail: 'Clarification sent, waiting for client', state: 'CLARIFYING', amount: 340000, lastActivity: '5h ago', action: 'View' },
    ],
    recentJobs: [
      { id: 'tl-job-005', client: 'Femi Kuti', job: 'Bespoke Suit — 2 pieces', state: 'EXECUTED', amount: 125000, updated: '2h ago' },
      { id: 'tl-job-006', client: 'Ngozi Peters', job: 'Traditional Attire', state: 'REASONING', amount: 78000, updated: '4h ago' },
      { id: 'tl-job-007', client: 'Emeka Obi', job: 'Wedding Outfit Set', state: 'CLARIFYING', amount: 195000, updated: '6h ago' },
      { id: 'tl-job-008', client: 'Amaka Eze', job: 'Corporate Uniforms x5', state: 'AWAITING_HUMAN_APPROVAL', amount: 175000, updated: '8h ago' },
    ],
    allJobs: [
      { id: 'tl-job-001', client: 'Tunde Bello', phone: '+234 801 234 5678', job: 'Bespoke Suits — 3 pieces', service: 'Bespoke Suits', state: 'AWAITING_HUMAN_APPROVAL', amount: 185000, lastActivity: '4m ago', updated: 'Sep 1, 2026' },
      { id: 'tl-job-002', client: 'Ola Martins', phone: '+234 802 345 6789', job: 'Traditional Agbada Set', service: 'Traditional Attire', state: 'NEEDS_SME_INPUT', amount: 95000, lastActivity: '30m ago', updated: 'Sep 1, 2026' },
      { id: 'tl-job-003', client: 'Chukwu Eze', phone: '+234 803 456 7890', job: 'Wedding Outfit — Groom', service: 'Wedding Outfits', state: 'FAILED_RETRY', amount: 220000, lastActivity: '2h ago', updated: 'Aug 31, 2026' },
      { id: 'tl-job-004', client: 'Sade Adu', phone: '+234 804 567 8901', job: 'Corporate Uniforms x10', service: 'Corporate Uniforms', state: 'CLARIFYING', amount: 340000, lastActivity: '5h ago', updated: 'Aug 31, 2026' },
      { id: 'tl-job-005', client: 'Femi Kuti', phone: '+234 805 678 9012', job: 'Bespoke Suit — 2 pieces', service: 'Bespoke Suits', state: 'EXECUTED', amount: 125000, lastActivity: '2h ago', updated: 'Aug 31, 2026' },
    ],
    quotes: [
      { id: 'qt-ct-001', client: 'Sarah Adeyemi', event: 'Wedding Catering', amount: 507000, status: 'awaiting_approval', created: 'Sep 1, 2026', updated: '2m ago' },
      { id: 'qt-ta-003', client: 'Ifeanyi Okoro', event: 'Suit Tailoring', amount: 120000, status: 'awaiting_approval', created: 'Aug 28, 2026', updated: '2d ago' },
    ],
    auditEvents: [],
  },
  catering: {
    key: 'catering',
    label: 'Event Catering',
    businessName: 'Savour Catering Co.',
    business_type: 'caterer',
    services: ['Wedding Catering', 'Corporate Catering', 'Birthday Catering', 'Buffet Service', 'Cocktail Events', 'Private Dining'],
    kpis: [
      { label: 'Active Jobs', value: 24, change: '+8.4%', changePositive: true, icon: 'BriefcaseIcon' },
      { label: 'Needs Your Input', value: 5, change: '+2 this week', changePositive: false, icon: 'ExclamationCircleIcon', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
      { label: 'Awaiting Approval', value: 8, change: '+3', changePositive: true, icon: 'ClockIcon', accent: true },
      { label: 'In Progress', value: 11, change: '+5.2%', changePositive: true, icon: 'ArrowPathIcon' },
      { label: 'Completed', value: 47, change: '+12.1%', changePositive: true, icon: 'CheckCircleIcon', iconBg: 'bg-[#DDFBEA]', iconColor: 'text-[#19D66B]' },
    ],
    attentionItems: [
      { id: 'ct-job-001', client: 'Sarah Adeyemi', job: 'Wedding Catering', summary: '120 guests · Ikeja', detail: 'Quote ready for review', state: 'AWAITING_HUMAN_APPROVAL', amount: 507000, lastActivity: '2m ago', action: 'Review Quote' },
      { id: 'ct-job-002', client: 'Michael Okoro', job: 'Corporate Catering', summary: 'Lekki Phase 1', detail: 'Missing menu confirmation', state: 'NEEDS_SME_INPUT', amount: 280000, lastActivity: '18m ago', action: 'Resolve' },
      { id: 'ct-job-003', client: 'David James', job: 'Corporate Launch', summary: 'Victoria Island', detail: 'Budget exceeds requested scope', state: 'FAILED_RETRY', amount: 415000, lastActivity: '1h ago', action: 'Review Issue' },
      { id: 'ct-job-004', client: 'Amaka Nwosu', job: 'Birthday Catering', summary: '80 guests · Yaba', detail: 'Clarification sent, waiting for client', state: 'CLARIFYING', amount: 195000, lastActivity: '3h ago', action: 'View' },
    ],
    recentJobs: [
      { id: 'ct-job-005', client: 'Tunde Bello', job: 'Corporate Catering — 50 pax', state: 'EXECUTED', amount: 185000, updated: '4h ago' },
      { id: 'ct-job-006', client: 'Ngozi Okafor', job: 'Wedding Catering — 200 pax', state: 'REASONING', amount: 820000, updated: '6h ago' },
      { id: 'ct-job-007', client: 'Emeka Eze', job: 'Birthday Catering — 80 pax', state: 'CLARIFYING', amount: 295000, updated: '8h ago' },
      { id: 'ct-job-008', client: 'Fatima Bello', job: 'Cocktail Event — 60 pax', state: 'AWAITING_HUMAN_APPROVAL', amount: 245000, updated: '12h ago' },
    ],
    allJobs: [
      { id: 'ct-job-001', client: 'Sarah Adeyemi', phone: '+234 801 234 5678', job: 'Wedding Catering', service: 'Wedding Catering', state: 'AWAITING_HUMAN_APPROVAL', amount: 507000, lastActivity: '2m ago', updated: 'Sep 1, 2026' },
      { id: 'ct-job-002', client: 'Michael Okoro', phone: '+234 802 345 6789', job: 'Corporate Catering', service: 'Corporate Catering', state: 'NEEDS_SME_INPUT', amount: 280000, lastActivity: '18m ago', updated: 'Sep 1, 2026' },
      { id: 'ct-job-003', client: 'David James', phone: '+234 803 456 7890', job: 'Corporate Launch', service: 'Corporate Catering', state: 'FAILED_RETRY', amount: 415000, lastActivity: '1h ago', updated: 'Aug 31, 2026' },
      { id: 'ct-job-004', client: 'Amaka Nwosu', phone: '+234 804 567 8901', job: 'Birthday Catering', service: 'Birthday Catering', state: 'CLARIFYING', amount: 195000, lastActivity: '3h ago', updated: 'Aug 31, 2026' },
      { id: 'ct-job-005', client: 'Tunde Bello', phone: '+234 805 678 9012', job: 'Corporate Catering — 50 pax', service: 'Corporate Catering', state: 'EXECUTED', amount: 185000, lastActivity: '4h ago', updated: 'Aug 31, 2026' },
    ],
    quotes: [
      { id: 'qt-ct-003', client: 'Tunde Bello', event: 'Corporate Catering', amount: 185000, status: 'sent', created: 'Aug 27, 2026', updated: '4h ago' },
      { id: 'qt-ct-002', client: 'Ngozi Okafor', event: 'Birthday Catering', amount: 350000, status: 'sent', created: 'Aug 29, 2026', updated: '1d ago' },
    ],
    auditEvents: [],
  },
  event_planning: {
    key: 'event_planning',
    label: 'Event Planning',
    businessName: 'Grand Events Co.',
    business_type: 'event_planner',
    services: ['Wedding Planning', 'Corporate Events', 'Birthday Parties', 'Gala Dinners', 'Product Launches', 'Conference Management'],
    kpis: [
      { label: 'Active Jobs', value: 15, change: '+3.7%', changePositive: true, icon: 'BriefcaseIcon' },
      { label: 'Needs Your Input', value: 4, change: '+1 this week', changePositive: false, icon: 'ExclamationCircleIcon', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
      { label: 'Awaiting Approval', value: 5, change: '+2', changePositive: true, icon: 'ClockIcon', accent: true },
      { label: 'In Progress', value: 6, change: '+2.8%', changePositive: true, icon: 'ArrowPathIcon' },
      { label: 'Completed', value: 38, change: '+8.9%', changePositive: true, icon: 'CheckCircleIcon', iconBg: 'bg-[#DDFBEA]', iconColor: 'text-[#19D66B]' },
    ],
    attentionItems: [
      { id: 'ep-job-001', client: 'Emeka Eze', job: 'Gala Dinner Planning', summary: '200 guests · Victoria Island', detail: 'Quote ready for review', state: 'AWAITING_HUMAN_APPROVAL', amount: 1250000, lastActivity: '3m ago', action: 'Review Quote' },
      { id: 'ep-job-002', client: 'Lola Okafor', job: 'Wedding Planning', summary: 'Lekki · Missing vendor list', detail: 'Awaiting vendor confirmation', state: 'NEEDS_SME_INPUT', amount: 2800000, lastActivity: '25m ago', action: 'Resolve' },
      { id: 'ep-job-003', client: 'Chidi Obi', job: 'Product Launch Event', summary: 'Ikeja · Budget constraint', detail: 'Scope exceeds budget', state: 'FAILED_RETRY', amount: 680000, lastActivity: '1h ago', action: 'Review Issue' },
      { id: 'ep-job-004', client: 'Amara Obi', job: 'Birthday Party Planning', summary: '100 guests · Yaba', detail: 'Clarification sent, waiting for client', state: 'CLARIFYING', amount: 450000, lastActivity: '4h ago', action: 'View' },
    ],
    recentJobs: [
      { id: 'ep-job-005', client: 'Seun Adesanya', job: 'Corporate Conference', state: 'EXECUTED', amount: 950000, updated: '5h ago' },
      { id: 'ep-job-006', client: 'Bisi Olatunji', job: 'Wedding Planning', state: 'REASONING', amount: 3200000, updated: '7h ago' },
      { id: 'ep-job-007', client: 'Kemi Adeyemi', job: 'Birthday Party — 50 guests', state: 'CLARIFYING', amount: 380000, updated: '9h ago' },
      { id: 'ep-job-008', client: 'Fola Bello', job: 'Product Launch Event', state: 'AWAITING_HUMAN_APPROVAL', amount: 720000, updated: '11h ago' },
    ],
    allJobs: [
      { id: 'ep-job-001', client: 'Emeka Eze', phone: '+234 801 234 5678', job: 'Gala Dinner Planning', service: 'Gala Dinners', state: 'AWAITING_HUMAN_APPROVAL', amount: 1250000, lastActivity: '3m ago', updated: 'Sep 1, 2026' },
      { id: 'ep-job-002', client: 'Lola Okafor', phone: '+234 802 345 6789', job: 'Wedding Planning', service: 'Wedding Planning', state: 'NEEDS_SME_INPUT', amount: 2800000, lastActivity: '25m ago', updated: 'Sep 1, 2026' },
      { id: 'ep-job-003', client: 'Chidi Obi', phone: '+234 803 456 7890', job: 'Product Launch Event', service: 'Product Launches', state: 'FAILED_RETRY', amount: 680000, lastActivity: '1h ago', updated: 'Aug 31, 2026' },
      { id: 'ep-job-004', client: 'Amara Obi', phone: '+234 804 567 8901', job: 'Birthday Party Planning', service: 'Birthday Parties', state: 'CLARIFYING', amount: 450000, lastActivity: '4h ago', updated: 'Aug 31, 2026' },
      { id: 'ep-job-005', client: 'Seun Adesanya', phone: '+234 805 678 9012', job: 'Corporate Conference', service: 'Conference Management', state: 'EXECUTED', amount: 950000, lastActivity: '5h ago', updated: 'Aug 31, 2026' },
    ],
    quotes: [
      { id: 'qt-ep-001', client: 'Emeka Eze', event: 'Gala Dinner Planning', amount: 1250000, status: 'awaiting_approval', created: 'Sep 1, 2026', updated: '3m ago' },
      { id: 'qt-ep-002', client: 'Fola Bello', event: 'Product Launch Event', amount: 720000, status: 'awaiting_approval', created: 'Aug 29, 2026', updated: '11h ago' },
      { id: 'qt-ep-003', client: 'Seun Adesanya', event: 'Corporate Conference', amount: 950000, status: 'sent', created: 'Aug 27, 2026', updated: '5h ago' },
      { id: 'qt-ep-002', client: 'Chidi Eze', event: 'Corporate Retreat', amount: 1200000, status: 'draft', created: 'Aug 30, 2026', updated: '8h ago' },
    ],
    auditEvents: [],
  },
  equipment_rental: {
    key: 'equipment_rental',
    label: 'Equipment Rental',
    businessName: 'ProRent Equipment',
    business_type: 'equipment_rental',
    services: ['Sound Systems', 'Lighting Rigs', 'Generators', 'Tent & Canopy', 'Furniture Rental', 'AV Equipment'],
    kpis: [
      { label: 'Active Jobs', value: 20, change: '+7.1%', changePositive: true, icon: 'BriefcaseIcon' },
      { label: 'Needs Your Input', value: 3, change: '+1 this week', changePositive: false, icon: 'ExclamationCircleIcon', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
      { label: 'Awaiting Approval', value: 7, change: '+3', changePositive: true, icon: 'ClockIcon', accent: true },
      { label: 'In Progress', value: 10, change: '+4.3%', changePositive: true, icon: 'ArrowPathIcon' },
      { label: 'Completed', value: 43, change: '+10.5%', changePositive: true, icon: 'CheckCircleIcon', iconBg: 'bg-[#DDFBEA]', iconColor: 'text-[#19D66B]' },
    ],
    attentionItems: [
      { id: 'er-job-001', client: 'Ade Okafor', job: 'Sound System Rental', summary: 'Ikeja · 2-day event', detail: 'Quote ready for review', state: 'AWAITING_HUMAN_APPROVAL', amount: 185000, lastActivity: '6m ago', action: 'Review Quote' },
      { id: 'er-job-002', client: 'Bisi Eze', job: 'Generator + Lighting Rig', summary: 'Lekki · Missing event date', detail: 'Awaiting event confirmation', state: 'NEEDS_SME_INPUT', amount: 320000, lastActivity: '35m ago', action: 'Resolve' },
      { id: 'er-job-003', client: 'Chuks Nwosu', job: 'Full AV Package', summary: 'Victoria Island · Budget constraint', detail: 'Scope exceeds budget', state: 'FAILED_RETRY', amount: 480000, lastActivity: '2h ago', action: 'Review Issue' },
      { id: 'er-job-004', client: 'Dupe Martins', job: 'Tent & Furniture Rental', summary: '200 guests · Yaba', detail: 'Clarification sent, waiting for client', state: 'CLARIFYING', amount: 250000, lastActivity: '5h ago', action: 'View' },
    ],
    recentJobs: [
      { id: 'er-job-005', client: 'Emeka Bello', job: 'Sound System — Wedding', state: 'EXECUTED', amount: 145000, updated: '3h ago' },
      { id: 'er-job-006', client: 'Funmi Olatunji', job: 'Generator Rental — 3 days', state: 'REASONING', amount: 210000, updated: '5h ago' },
      { id: 'er-job-007', client: 'Goke Adeyemi', job: 'Lighting Rig — Corporate', state: 'CLARIFYING', amount: 175000, updated: '7h ago' },
      { id: 'er-job-008', client: 'Hauwa Eze', job: 'Full AV Package', state: 'AWAITING_HUMAN_APPROVAL', amount: 390000, updated: '9h ago' },
    ],
    allJobs: [
      { id: 'er-job-001', client: 'Ade Okafor', phone: '+234 801 234 5678', job: 'Sound System Rental', service: 'Sound Systems', state: 'AWAITING_HUMAN_APPROVAL', amount: 185000, lastActivity: '6m ago', updated: 'Sep 1, 2026' },
      { id: 'er-job-002', client: 'Bisi Eze', phone: '+234 802 345 6789', job: 'Generator + Lighting Rig', service: 'Generators', state: 'NEEDS_SME_INPUT', amount: 320000, lastActivity: '35m ago', updated: 'Sep 1, 2026' },
      { id: 'er-job-003', client: 'Chuks Nwosu', phone: '+234 803 456 7890', job: 'Full AV Package', service: 'AV Equipment', state: 'FAILED_RETRY', amount: 480000, lastActivity: '2h ago', updated: 'Aug 31, 2026' },
      { id: 'er-job-004', client: 'Dupe Martins', phone: '+234 804 567 8901', job: 'Tent & Furniture Rental', service: 'Tent & Canopy', state: 'CLARIFYING', amount: 250000, lastActivity: '5h ago', updated: 'Aug 31, 2026' },
      { id: 'er-job-005', client: 'Emeka Bello', phone: '+234 805 678 9012', job: 'Sound System — Wedding', service: 'Sound Systems', state: 'EXECUTED', amount: 145000, lastActivity: '3h ago', updated: 'Aug 31, 2026' },
    ],
    quotes: [
      { id: 'qt-er-001', client: 'Ade Okafor', event: 'Sound System Rental', amount: 185000, status: 'awaiting_approval', created: 'Sep 1, 2026', updated: '6m ago' },
      { id: 'qt-er-002', client: 'Hauwa Eze', event: 'Full AV Package', amount: 390000, status: 'awaiting_approval', created: 'Aug 29, 2026', updated: '9h ago' },
      { id: 'qt-er-003', client: 'Emeka Bello', event: 'Sound System — Wedding', amount: 145000, status: 'sent', created: 'Aug 27, 2026', updated: '3h ago' },
      { id: 'qt-er-004', client: 'Dupe Martins', event: 'Tent & Furniture Rental', amount: 250000, status: 'draft', created: 'Aug 31, 2026', updated: '5h ago' },
    ],
    auditEvents: [],
  },
};

interface PersonaContextValue {
  currentPersona: PersonaData;
  setPersona: (key: PersonaKey) => void;
  allPersonas: { key: PersonaKey; label: string }[];
}

const PersonaContext = createContext<PersonaContextValue>({
  currentPersona: personaData.event_decoration,
  setPersona: () => {},
  allPersonas: [],
});

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentKey, setCurrentKey] = useState<PersonaKey>('event_decoration');
  const [dynamicData, setDynamicData] = useState<PersonaData | null>(null);

  const allPersonas = Object.values(personaData).map(p => ({ key: p.key, label: p.label }));

  useEffect(() => {
    async function hydratePersona() {
      try {
        const businessId = `biz-${currentKey.replace('_', '-')}`;
        const { jobs } = await getJobs(businessId);
        
        const staticMeta = personaData[currentKey];
        
        const allJobs: Job[] = jobs.map(j => ({
          id: j.job_id,
          client: j.extracted_fields?.client_name || 'Unknown Client',
          phone: j.extracted_fields?.client_phone || 'N/A',
          job: j.extracted_fields?.event_type || 'Unknown Event',
          service: j.extracted_fields?.event_type || 'General Service',
          state: j.state as JobState,
          amount: Number(j.extracted_fields?.amount || 0),
          lastActivity: new Date(j.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          updated: new Date(j.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        }));

        const sortedJobs = [...allJobs].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
        
        const recentJobs: RecentJob[] = sortedJobs.slice(0, 4).map(j => ({
          id: j.id,
          client: j.client,
          job: j.job,
          state: j.state,
          amount: j.amount,
          updated: j.lastActivity,
        }));

        const attentionItems: AttentionItem[] = jobs
          .filter(j => ['NEEDS_SME_INPUT', 'AWAITING_HUMAN_APPROVAL', 'FAILED_RETRY', 'CLARIFYING'].includes(j.state))
          .map(j => {
            let action = 'View';
            if (j.state === 'AWAITING_HUMAN_APPROVAL') action = 'Review Quote';
            if (j.state === 'NEEDS_SME_INPUT') action = 'Resolve';
            if (j.state === 'FAILED_RETRY') action = 'Review Issue';
            
            return {
              id: j.job_id,
              client: j.extracted_fields?.client_name || 'Unknown Client',
              job: j.extracted_fields?.event_type || 'Unknown Event',
              summary: j.extracted_fields?.venue_location || 'No location',
              detail: j.error_message || (j.missing_required_fields?.length ? `Missing: ${j.missing_required_fields.join(', ')}` : 'Requires attention'),
              state: j.state as JobState,
              amount: Number(j.extracted_fields?.amount || 0),
              lastActivity: new Date(j.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
              action,
            };
          });

        const quotes: Quote[] = jobs.filter(j => j.quote).map(j => ({
          id: j.quote!.id,
          client: j.extracted_fields?.client_name || 'Unknown Client',
          event: j.extracted_fields?.event_type || 'Unknown Event',
          amount: j.quote!.total || Number(j.extracted_fields?.amount || 0),
          status: (j.quote!.status === 'draft' ? 'draft' : j.quote!.status === 'sent' ? 'sent' : 'awaiting_approval') as QuoteStatus,
          created: new Date(j.quote!.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          updated: new Date(j.quote!.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        }));

        const activeCount = jobs.filter(j => !['EXECUTED', 'CANCELLED'].includes(j.state)).length;
        const needsInputCount = jobs.filter(j => j.state === 'NEEDS_SME_INPUT').length;
        const awaitingCount = jobs.filter(j => j.state === 'AWAITING_HUMAN_APPROVAL').length;
        const inProgressCount = jobs.filter(j => ['PROCESSING', 'CLARIFYING', 'REASONING'].includes(j.state)).length;
        const completedCount = jobs.filter(j => j.state === 'EXECUTED').length;

        const kpis: KPI[] = [
          { label: 'Active Jobs', value: activeCount, change: '+5.0%', changePositive: true, icon: 'BriefcaseIcon' },
          { label: 'Needs Your Input', value: needsInputCount, change: '+1 this week', changePositive: false, icon: 'ExclamationCircleIcon', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
          { label: 'Awaiting Approval', value: awaitingCount, change: '+2', changePositive: true, icon: 'ClockIcon', accent: true },
          { label: 'In Progress', value: inProgressCount, change: '+1.0%', changePositive: true, icon: 'ArrowPathIcon' },
          { label: 'Completed', value: completedCount, change: '+8.0%', changePositive: true, icon: 'CheckCircleIcon', iconBg: 'bg-[#DDFBEA]', iconColor: 'text-[#19D66B]' },
        ];

        let auditEvents: AuditEvent[] = [];
        jobs.forEach(j => {
          if (j.audit_events && Array.isArray(j.audit_events)) {
            const clientName = j.extracted_fields?.client_name || 'Unknown Client';
            const mappedEvents = j.audit_events.map((e: any) => ({
              ...e,
              detail: e.detail ? `${clientName} · ${e.detail}` : clientName
            }));
            auditEvents = auditEvents.concat(mappedEvents);
          }
        });
        
        auditEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setDynamicData({
          ...staticMeta,
          allJobs,
          recentJobs,
          attentionItems,
          quotes,
          kpis,
          auditEvents
        });
      } catch (e) {
        console.error('Failed to fetch jobs from API, falling back to mock data', e);
        setDynamicData(personaData[currentKey]);
      }
    }

    hydratePersona();
  }, [currentKey]);

  return (
    <PersonaContext.Provider value={{
      currentPersona: dynamicData || personaData[currentKey],
      setPersona: setCurrentKey,
      allPersonas,
    }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
