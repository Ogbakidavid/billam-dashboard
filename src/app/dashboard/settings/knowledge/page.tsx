'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import EmptyState from '@/app/dashboard/components/EmptyState';
import { getKnowledgeSources, createKnowledgeSource, updateKnowledgeSource, deleteKnowledgeSource } from '@/lib/api';
import { usePersona } from '@/app/dashboard/context/PersonaContext';

// ── V2 API-aligned types ───────────────────────────────────────────────────────
type KnowledgeStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';

type SourceType = 'Pricing' | 'Business information' | 'Services' | 'Policies' | 'Other';

interface KnowledgeSource {
  knowledgeId: string;
  businessId: string;
  name: string;
  sourceType: SourceType;
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
  /** 'file' = uploaded document, 'manual' = typed information */
  inputMethod: 'file' | 'manual';
  fileName?: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const INITIAL_SOURCES: KnowledgeSource[] = [
  {
    knowledgeId: 'ks-01',
    businessId: 'biz-001',
    name: 'Event Vendor Price List',
    sourceType: 'Pricing',
    status: 'READY',
    createdAt: '2026-09-08T09:00:00Z',
    updatedAt: '2026-09-08T09:12:00Z',
    inputMethod: 'file',
    fileName: 'price-list-2026.pdf',
  },
  {
    knowledgeId: 'ks-02',
    businessId: 'biz-001',
    name: 'Services & Packages',
    sourceType: 'Business information',
    status: 'PROCESSING',
    createdAt: '2026-09-08T10:00:00Z',
    updatedAt: '2026-09-08T10:01:00Z',
    inputMethod: 'manual',
  },
  {
    knowledgeId: 'ks-03',
    businessId: 'biz-001',
    name: 'Old Pricing Sheet',
    sourceType: 'Pricing',
    status: 'FAILED',
    createdAt: '2026-09-07T14:00:00Z',
    updatedAt: '2026-09-07T14:02:00Z',
    inputMethod: 'file',
    fileName: 'pricing-old.xlsx',
    errorMessage: "Couldn't process this file. Check the format and try again.",
  },
  {
    knowledgeId: 'ks-04',
    businessId: 'biz-001',
    name: 'Cancellation Policy',
    sourceType: 'Policies',
    status: 'READY',
    createdAt: '2026-09-05T08:00:00Z',
    updatedAt: '2026-09-05T08:08:00Z',
    inputMethod: 'file',
    fileName: 'cancellation-policy.pdf',
  },
];

const MOCK_BUSINESS_RULES = [
  'Always confirm the event date and guest count before preparing a quote.',
  'Minimum booking value is ₦150,000 for all events.',
  'A 30% deposit is required to confirm any booking.',
  'Travel fees apply for events outside Lagos Island.',
];

// ── Config ─────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<KnowledgeStatus, {
  label: string; bg: string; text: string; dot: string; icon: string; animate?: boolean;
}> = {
  UPLOADING:  { label: 'Uploading',   bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-400',   icon: 'ArrowUpTrayIcon',       animate: true },
  PROCESSING: { label: 'Processing',  bg: 'bg-amber-50',  text: 'text-amber-600',  dot: 'bg-amber-400',  icon: 'ArrowPathIcon',         animate: true },
  READY:      { label: 'Ready',       bg: 'bg-[#DDFBEA]', text: 'text-[#079A4F]',  dot: 'bg-[#19D66B]',  icon: 'CheckCircleIcon' },
  FAILED:     { label: 'Failed',      bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400',    icon: 'ExclamationCircleIcon' },
};

const SOURCE_TYPE_CONFIG: Record<SourceType, { bg: string; text: string; icon: string }> = {
  'Pricing':             { bg: 'bg-[#DDFBEA]', text: 'text-[#079A4F]', icon: 'CurrencyDollarIcon' },
  'Business information':{ bg: 'bg-blue-50',   text: 'text-blue-600',  icon: 'BuildingOffice2Icon' },
  'Services':            { bg: 'bg-purple-50', text: 'text-purple-600',icon: 'SparklesIcon' },
  'Policies':            { bg: 'bg-amber-50',  text: 'text-amber-600', icon: 'DocumentTextIcon' },
  'Other':               { bg: 'bg-[#F0F0EE]', text: 'text-[#6F716E]', icon: 'FolderIcon' },
};

const SOURCE_TYPES: SourceType[] = ['Pricing', 'Business information', 'Services', 'Policies', 'Other'];

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

// ── Card wrapper ───────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white border border-[#E7E7E3] rounded-[20px] ${className}`}
    style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04), 0 4px 16px rgba(20,25,20,0.06)' }}
  >
    {children}
  </div>
);

// ── Status pill ────────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: KnowledgeStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0 ${cfg.animate ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  );
}

// ── Source type badge ──────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: SourceType }) {
  const cfg = SOURCE_TYPE_CONFIG[type];
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {type}
    </span>
  );
}

// ── Three-dot menu ─────────────────────────────────────────────────────────────
interface ThreeDotMenuProps {
  source: KnowledgeSource;
  onView: () => void;
  onRetry: () => void;
  onDelete: () => void;
}

function ThreeDotMenu({ source, onView, onRetry, onDelete }: ThreeDotMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-1.5 rounded-lg hover:bg-[#F0F0EE] text-[#6F716E] transition-colors"
        aria-label="Source actions"
      >
        <Icon name="EllipsisVerticalIcon" size={16} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#E7E7E3] rounded-[14px] py-1 z-20"
          style={{ boxShadow: '0 4px 24px rgba(20,25,20,0.12)' }}
        >
          <button
            onClick={() => { setOpen(false); onView(); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#171817] hover:bg-[#F0F0EE] transition-colors"
          >
            <Icon name="EyeIcon" size={14} className="text-[#6F716E]" />
            View
          </button>
          {source.status === 'FAILED' && (
            <button
              onClick={() => { setOpen(false); onRetry(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <Icon name="ArrowPathIcon" size={14} />
              Retry
            </button>
          )}
          <div className="my-1 border-t border-[#E7E7E3]" />
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Icon name="TrashIcon" size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Delete confirmation modal ──────────────────────────────────────────────────
function DeleteConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative w-full sm:max-w-sm bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(20,25,20,0.16)' }}
      >
        <div className="p-5">
          <div className="w-10 h-10 rounded-[14px] bg-red-50 flex items-center justify-center mb-4">
            <Icon name="TrashIcon" size={20} className="text-red-500" />
          </div>
          <h3 className="text-[15px] font-bold text-[#171817]">Remove knowledge source?</h3>
          <p className="text-[13px] text-[#6F716E] mt-1.5">
            <span className="font-semibold text-[#171817]">{name}</span> will be removed. BillAm will no longer use this information.
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-[#6F716E] bg-white border border-[#E7E7E3] rounded-xl hover:bg-[#F0F0EE] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View source modal ──────────────────────────────────────────────────────────
function ViewSourceModal({ source, onClose }: { source: KnowledgeSource; onClose: () => void }) {
  const sCfg = STATUS_CONFIG[source.status];
  const tCfg = SOURCE_TYPE_CONFIG[source.sourceType];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(20,25,20,0.16)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E3]">
          <h3 className="text-[15px] font-bold text-[#171817]">Knowledge source</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E]">
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${tCfg.bg}`}>
              <Icon name={tCfg.icon} size={18} className={tCfg.text} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#171817]">{source.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <TypeBadge type={source.sourceType} />
                <StatusPill status={source.status} />
              </div>
            </div>
          </div>
          <div className="space-y-2.5">
            {source.fileName && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-xl">
                <Icon name="DocumentIcon" size={14} className="text-[#6F716E]" />
                <span className="text-[12px] text-[#6F716E] truncate">{source.fileName}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-xl">
                <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wide">Added</p>
                <p className="text-[12px] font-semibold text-[#171817] mt-0.5">{formatDate(source.createdAt)}</p>
              </div>
              <div className="px-3 py-2.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-xl">
                <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wide">Updated</p>
                <p className="text-[12px] font-semibold text-[#171817] mt-0.5">{formatDate(source.updatedAt)}</p>
              </div>
            </div>
            <div className="px-3 py-2.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-xl">
              <p className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wide">Source type</p>
              <p className="text-[12px] font-semibold text-[#171817] mt-0.5">{source.inputMethod === 'file' ? 'Uploaded document' : 'Manually entered'}</p>
            </div>
          </div>
          {source.status === 'FAILED' && source.errorMessage && (
            <div className="flex items-start gap-2.5 px-3 py-3 bg-red-50 border border-red-100 rounded-xl">
              <Icon name="ExclamationTriangleIcon" size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[12px] text-red-600">{source.errorMessage}</p>
            </div>
          )}
          {source.status === 'READY' && (
            <div className="flex items-start gap-2.5 px-3 py-3 bg-[#F0FFF6] border border-[#19D66B]/20 rounded-xl">
              <Icon name="CheckCircleIcon" size={14} className="text-[#19D66B] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#079A4F]">This source is ready and BillAm can use it when preparing quotes and handling client questions.</p>
            </div>
          )}
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-[13px] font-semibold text-[#6F716E] bg-white border border-[#E7E7E3] rounded-xl hover:bg-[#F0F0EE] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Knowledge modal ────────────────────────────────────────────────────────
type AddStep = 'choose' | 'upload' | 'manual';

interface AddKnowledgeModalProps {
  onClose: () => void;
  onAdd: (source: Omit<KnowledgeSource, 'knowledgeId' | 'businessId' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

function AddKnowledgeModal({ onClose, onAdd }: AddKnowledgeModalProps) {
  const [step, setStep] = useState<AddStep>('choose');

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState<SourceType>('Other');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual form state
  const [manualName, setManualName] = useState('');
  const [manualType, setManualType] = useState<SourceType>('Business information');
  const [manualContent, setManualContent] = useState('');

  const canUpload = uploadFile !== null && uploadName.trim().length > 0;
  const canManual = manualName.trim().length > 0 && manualContent.trim().length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setUploadFile(file);
    if (file && !uploadName) setUploadName(file.name.replace(/\.[^.]+$/, ''));
  };

  const handleUploadSubmit = () => {
    if (!canUpload) return;
    onAdd({
      name: uploadName.trim(),
      sourceType: uploadType,
      inputMethod: 'file',
      fileName: uploadFile!.name,
    });
    onClose();
  };

  const handleManualSubmit = () => {
    if (!canManual) return;
    onAdd({
      name: manualName.trim(),
      sourceType: manualType,
      inputMethod: 'manual',
    });
    onClose();
  };

  const inputClass = 'w-full px-3 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-[13px] text-[#171817] placeholder:text-[#999C98] outline-none focus:ring-2 focus:ring-[#19D66B]/20 focus:border-[#19D66B]/40 transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(20,25,20,0.16)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E3]">
          <div className="flex items-center gap-2.5">
            {step !== 'choose' && (
              <button
                onClick={() => setStep('choose')}
                className="p-1.5 rounded-lg hover:bg-[#F0F0EE] transition-colors text-[#6F716E]"
              >
                <Icon name="ChevronLeftIcon" size={16} />
              </button>
            )}
            <div>
              <h3 className="text-[15px] font-bold text-[#171817]">
                {step === 'choose' ? 'Add knowledge' : step === 'upload' ? 'Upload document' : 'Add information manually'}
              </h3>
              <p className="text-[12px] text-[#6F716E] mt-0.5">
                {step === 'choose' ?'Choose how you want to add business information.'
                  : step === 'upload' ?'Upload a document for BillAm to learn from.' :'Type the information BillAm should know.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E]">
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Step: choose */}
          {step === 'choose' && (
            <div className="space-y-3">
              <button
                onClick={() => setStep('upload')}
                className="w-full flex items-start gap-4 p-4 bg-white border border-[#E7E7E3] rounded-[16px] hover:border-[#19D66B]/40 hover:bg-[#F0FFF6] transition-all text-left group"
                style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
              >
                <div className="w-10 h-10 rounded-[14px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
                  <Icon name="ArrowUpTrayIcon" size={20} className="text-[#19D66B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#171817]">Upload document</p>
                  <p className="text-[12px] text-[#6F716E] mt-0.5">Upload a PDF, Word doc, or text file with your business information.</p>
                </div>
                <Icon name="ChevronRightIcon" size={16} className="text-[#999C98] shrink-0 mt-1 group-hover:text-[#19D66B] transition-colors" />
              </button>
              <button
                onClick={() => setStep('manual')}
                className="w-full flex items-start gap-4 p-4 bg-white border border-[#E7E7E3] rounded-[16px] hover:border-[#19D66B]/40 hover:bg-[#F0FFF6] transition-all text-left group"
                style={{ boxShadow: '0 1px 3px rgba(20,25,20,0.04)' }}
              >
                <div className="w-10 h-10 rounded-[14px] bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon name="PencilSquareIcon" size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#171817]">Add information manually</p>
                  <p className="text-[12px] text-[#6F716E] mt-0.5">Type or paste business information directly — pricing, services, policies, and more.</p>
                </div>
                <Icon name="ChevronRightIcon" size={16} className="text-[#999C98] shrink-0 mt-1 group-hover:text-[#19D66B] transition-colors" />
              </button>
            </div>
          )}

          {/* Step: upload */}
          {step === 'upload' && (
            <div className="space-y-4">
              {/* File drop zone */}
              <div>
                <label className="text-[12px] font-semibold text-[#171817] block mb-1.5">File <span className="text-red-500">*</span></label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-[16px] transition-colors ${
                    uploadFile
                      ? 'border-[#19D66B]/40 bg-[#F0FFF6]'
                      : 'border-[#E7E7E3] bg-[#FAFAF9] hover:border-[#19D66B]/30 hover:bg-[#F0FFF6]'
                  }`}
                >
                  {uploadFile ? (
                    <>
                      <div className="w-9 h-9 rounded-[12px] bg-[#DDFBEA] flex items-center justify-center">
                        <Icon name="DocumentCheckIcon" size={18} className="text-[#19D66B]" />
                      </div>
                      <p className="text-[13px] font-semibold text-[#171817]">{uploadFile.name}</p>
                      <p className="text-[11px] text-[#6F716E]">{(uploadFile.size / 1024).toFixed(0)} KB — click to change</p>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-[12px] bg-[#F0F0EE] flex items-center justify-center">
                        <Icon name="ArrowUpTrayIcon" size={18} className="text-[#6F716E]" />
                      </div>
                      <p className="text-[13px] font-semibold text-[#171817]">Click to select a file</p>
                      <p className="text-[11px] text-[#6F716E]">PDF, DOCX, TXT — up to 10 MB</p>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#171817] block mb-1.5">Source name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Event Vendor Price List"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#171817] block mb-1.5">Category</label>
                <div className="flex flex-wrap gap-2">
                  {SOURCE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUploadType(t)}
                      className={`px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-colors ${
                        uploadType === t
                          ? 'bg-[#DDFBEA] text-[#079A4F] border-transparent'
                          : 'bg-white border-[#E7E7E3] text-[#6F716E] hover:bg-[#F0F0EE]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                <Icon name="InformationCircleIcon" size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-amber-700">After uploading, BillAm will process the file. The source will only be usable once processing is complete.</p>
              </div>
            </div>
          )}

          {/* Step: manual */}
          {step === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-[#171817] block mb-1.5">Source name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Services & Packages"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#171817] block mb-1.5">Category</label>
                <div className="flex flex-wrap gap-2">
                  {SOURCE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setManualType(t)}
                      className={`px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-colors ${
                        manualType === t
                          ? 'bg-[#DDFBEA] text-[#079A4F] border-transparent'
                          : 'bg-white border-[#E7E7E3] text-[#6F716E] hover:bg-[#F0F0EE]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#171817] block mb-1.5">
                  Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Describe your services, pricing, policies, or any other information BillAm should know about your business..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
                {manualContent.trim().length > 0 && (
                  <p className="text-[11px] text-[#999C98] mt-1">{manualContent.trim().split(/\s+/).length} words</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'choose' && (
          <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-[#E7E7E3]">
            <button
              onClick={() => setStep('choose')}
              className="px-4 py-2 text-[13px] font-semibold text-[#6F716E] bg-white border border-[#E7E7E3] rounded-xl hover:bg-[#F0F0EE] transition-colors"
            >
              Back
            </button>
            <button
              onClick={step === 'upload' ? handleUploadSubmit : handleManualSubmit}
              disabled={step === 'upload' ? !canUpload : !canManual}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-[#19D66B] rounded-xl hover:bg-[#079A4F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ boxShadow: (step === 'upload' ? canUpload : canManual) ? '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' : undefined }}
            >
              {step === 'upload' ? 'Upload' : 'Add information'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Business Rules card ────────────────────────────────────────────────────────
function BusinessRulesCard({ onEdit }: { onEdit: () => void }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[12px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
            <Icon name="ClipboardDocumentListIcon" size={18} className="text-[#19D66B]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#171817]">Business Rules</h3>
            <p className="text-[12px] text-[#6F716E] mt-0.5">Rules BillAm should follow when handling your client requests.</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#6F716E] bg-white border border-[#E7E7E3] rounded-xl hover:bg-[#F0F0EE] transition-colors shrink-0"
        >
          <Icon name="PencilSquareIcon" size={13} />
          View / Edit
        </button>
      </div>
      <div className="space-y-2">
        {MOCK_BUSINESS_RULES.map((rule, i) => (
          <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-[12px]">
            <span className="w-4 h-4 rounded-full bg-[#DDFBEA] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[9px] font-bold text-[#079A4F]">{i + 1}</span>
            </span>
            <p className="text-[12px] text-[#171817] leading-relaxed">{rule}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── How BillAm uses your knowledge card ───────────────────────────────────────
function HowBillAmUsesCard() {
  const items = [
    { icon: 'DocumentTextIcon', text: 'Used when preparing quotes' },
    { icon: 'ChatBubbleLeftRightIcon', text: 'Used when handling client questions' },
    { icon: 'MagnifyingGlassIcon', text: 'Used to understand your services and pricing' },
    { icon: 'ShieldCheckIcon', text: "BillAm won't invent business information it cannot verify" },
  ];
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-[12px] bg-[#DDFBEA] flex items-center justify-center shrink-0">
          <Icon name="LightBulbIcon" size={18} className="text-[#19D66B]" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-[#171817]">How BillAm uses your knowledge</h3>
          <p className="text-[12px] text-[#6F716E] mt-0.5">Only Ready sources are used. BillAm works from verified information.</p>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#DDFBEA] flex items-center justify-center shrink-0">
              <Icon name="CheckIcon" size={11} className="text-[#19D66B]" />
            </div>
            <p className="text-[12px] text-[#6F716E]">{item.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function KnowledgeBasePage() {
  const { currentPersona } = usePersona();
  const businessId = `biz-${currentPersona.key.replace('_', '-')}`;
  
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeSource | null>(null);
  const [viewTarget, setViewTarget] = useState<KnowledgeSource | null>(null);
  const [retrying, setRetrying] = useState<Set<string>>(new Set());
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    async function loadSources() {
      setLoading(true);
      try {
        const data = await getKnowledgeSources(businessId);
        setSources(data.map(d => ({
          knowledgeId: d.knowledge_id,
          businessId: d.business_id,
          name: d.name,
          sourceType: d.source_type as SourceType,
          status: d.status,
          createdAt: d.created_at,
          updatedAt: d.created_at,
          errorMessage: d.error_message,
          inputMethod: d.input_method,
          fileName: d.file_name,
        })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSources();
  }, [businessId]);

  const readyCount = sources.filter((s) => s.status === 'READY').length;

  const handleAdd = async (data: Omit<KnowledgeSource, 'knowledgeId' | 'businessId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      const newEntry = await createKnowledgeSource({
        business_id: businessId,
        name: data.name,
        source_type: data.sourceType,
        input_method: data.inputMethod,
        file_name: data.fileName,
      });
      setSources((prev) => [{
        knowledgeId: newEntry.knowledge_id,
        businessId: newEntry.business_id,
        name: newEntry.name,
        sourceType: newEntry.source_type as SourceType,
        status: newEntry.status,
        createdAt: newEntry.created_at,
        updatedAt: newEntry.created_at,
        errorMessage: newEntry.error_message,
        inputMethod: newEntry.input_method,
        fileName: newEntry.file_name,
      }, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetry = async (id: string) => {
    setRetrying((prev) => new Set([...prev, id]));
    try {
      // For mocking purposes we just restart processing here
      const updated = await updateKnowledgeSource(id, { status: 'PROCESSING' });
      setSources((prev) =>
        prev.map((s) => s.knowledgeId === id
          ? { ...s, status: updated.status, errorMessage: updated.error_message }
          : s
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setRetrying((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKnowledgeSource(id);
      setSources((prev) => prev.filter((s) => s.knowledgeId !== id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const isEmpty = !loading && sources.length === 0;

  return (
    <>
      <div className="space-y-4">
        {/* Page header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold text-[#171817]">Knowledge Base</h2>
            <p className="text-[12px] text-[#6F716E] mt-0.5 max-w-md">
              Give BillAm the information it needs to understand how your business works and prepare better quotes.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#19D66B] text-white text-[13px] font-semibold rounded-xl hover:bg-[#079A4F] transition-colors shrink-0"
            style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
          >
            <Icon name="PlusIcon" size={15} />
            Add knowledge
          </button>
        </div>

        {/* Knowledge Sources card */}
        <Card>
          <div className="px-5 py-4 border-b border-[#E7E7E3] flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-bold text-[#171817]">Knowledge sources</h3>
              {!isEmpty && (
                <p className="text-[12px] text-[#6F716E] mt-0.5">
                  {readyCount} of {sources.length} {readyCount === 1 ? 'source' : 'sources'} ready
                </p>
              )}
            </div>
            {!isEmpty && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F0F0EE] text-[#6F716E]">
                {sources.length}
              </span>
            )}
          </div>

          {isEmpty ? (
            <EmptyState
              icon="BookOpenIcon"
              title="Knowledge Base is ready for your business information."
              description="Add the information BillAm should use when understanding requests and preparing quotes."
              action={{ label: '+ Add knowledge', onClick: () => setShowAddModal(true) }}
            />
          ) : (
            <div className="divide-y divide-[#E7E7E3]">
              {sources.map((source) => {
                const sCfg = STATUS_CONFIG[source.status];
                const tCfg = SOURCE_TYPE_CONFIG[source.sourceType];
                const isInProgress = source.status === 'UPLOADING' || source.status === 'PROCESSING';
                return (
                  <div key={source.knowledgeId} className="px-5 py-4 hover:bg-[#FAFAF9] transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Source icon */}
                      <div className={`w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 mt-0.5 ${tCfg.bg}`}>
                        <Icon name={tCfg.icon} size={16} className={tCfg.text} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#171817] truncate">{source.name}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <TypeBadge type={source.sourceType} />
                              <span className="text-[11px] text-[#999C98]">Updated {formatDate(source.updatedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <StatusPill status={source.status} />
                            <ThreeDotMenu
                              source={source}
                              onView={() => setViewTarget(source)}
                              onRetry={() => handleRetry(source.knowledgeId)}
                              onDelete={() => setDeleteTarget(source)}
                            />
                          </div>
                        </div>

                        {/* Failed error */}
                        {source.status === 'FAILED' && (
                          <div className="mt-2.5 flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-[12px]">
                            <Icon name="ExclamationTriangleIcon" size={13} className="text-red-500 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] text-red-600">
                                {source.errorMessage ?? "Couldn't process this file."}
                              </p>
                              <button
                                onClick={() => handleRetry(source.knowledgeId)}
                                disabled={retrying.has(source.knowledgeId)}
                                className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
                              >
                                <Icon name="ArrowPathIcon" size={12} />
                                Retry
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Progress bar for in-progress */}
                        {isInProgress && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-[#E7E7E3] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full animate-pulse"
                                style={{ width: source.status === 'UPLOADING' ? '25%' : '65%' }}
                              />
                            </div>
                            <span className="text-[11px] text-[#999C98] shrink-0">
                              {source.status === 'UPLOADING' ? 'Uploading…' : 'Processing…'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Business Rules card */}
        <BusinessRulesCard onEdit={() => setShowRulesModal(true)} />

        {/* How BillAm uses your knowledge */}
        <HowBillAmUsesCard />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddKnowledgeModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.name}
          onConfirm={() => handleDelete(deleteTarget.knowledgeId)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {viewTarget && (
        <ViewSourceModal source={viewTarget} onClose={() => setViewTarget(null)} />
      )}

      {/* Business Rules modal (simple view/edit placeholder) */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowRulesModal(false)} />
          <div
            className="relative w-full sm:max-w-lg bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden"
            style={{ boxShadow: '0 8px 40px rgba(20,25,20,0.16)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E3]">
              <div>
                <h3 className="text-[15px] font-bold text-[#171817]">Business Rules</h3>
                <p className="text-[12px] text-[#6F716E] mt-0.5">Rules BillAm follows when handling your client requests.</p>
              </div>
              <button onClick={() => setShowRulesModal(false)} className="p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E]">
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>
            <div className="p-5 space-y-2.5">
              {MOCK_BUSINESS_RULES.map((rule, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-3 bg-[#FAFAF9] border border-[#E7E7E3] rounded-[12px]">
                  <span className="w-5 h-5 rounded-full bg-[#DDFBEA] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#079A4F]">{i + 1}</span>
                  </span>
                  <p className="text-[13px] text-[#171817] leading-relaxed">{rule}</p>
                </div>
              ))}
              <p className="text-[11px] text-[#999C98] pt-1">Full rule editing will be available in a future update.</p>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => setShowRulesModal(false)}
                className="w-full px-4 py-2.5 text-[13px] font-semibold text-[#6F716E] bg-white border border-[#E7E7E3] rounded-xl hover:bg-[#F0F0EE] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
