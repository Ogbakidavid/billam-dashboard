'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineItem, Contingency } from '@/app/dashboard/types';
import { formatNGN } from '@/lib/currency';
import { editQuote } from '@/lib/api';

interface QuoteEditorProps {
  jobId?: string;
  onClose: () => void;
  onSave: (total: number) => void;
  clientName?: string;
  eventName?: string;
  initialItems?: LineItem[];
}

// Default mock data using canonical LineItem/Contingency fields
const defaultItems: LineItem[] = [
  { id: '1', name: 'Full Venue Decoration', quantity: 1, unit_price: 450000, total: 450000 },
  { id: '2', name: 'Stage & Backdrop Setup', quantity: 1, unit_price: 180000, total: 180000 },
  { id: '3', name: 'Table Styling', quantity: 30, unit_price: 5000, total: 150000 },
  { id: '4', name: 'Floral Arrangements', quantity: 1, unit_price: 120000, total: 120000 },
  { id: '5', name: 'Lighting Setup', quantity: 1, unit_price: 85000, total: 85000 },
];

const defaultContingencies: Contingency[] = [
  { id: 'c1', label: 'Transport & Logistics', rate: null, amount: 35000 },
];

let nextId = 100;

export default function QuoteEditor({ jobId, onClose, onSave, clientName = 'Adaeze Okonkwo', eventName = 'Wedding Decoration', initialItems }: QuoteEditorProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>(initialItems || defaultItems);
  const [contingencies, setContingencies] = useState<Contingency[]>(defaultContingencies);

  // All monetary values remain numeric; format only at render time
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const contingencyTotal = contingencies.reduce((sum, c) => sum + c.amount, 0);
  const total = subtotal + contingencyTotal;

  const handleSave = async () => {
    if (!jobId) {
      // No real job context here yet (dashboard overview / quotes list
      // still use mock data) — just update local UI for now.
      onSave(total);
      return;
    }
    try {
      await editQuote(jobId, lineItems);
      onSave(total);
    } catch (err) {
      console.error('Failed to save quote:', err);
      onSave(total);
    }
  };

  // Update a line item field; recalculate total inline
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: field === 'name' ? value : Number(value) || 0 };
      updated.total = updated.quantity * updated.unit_price;
      return updated;
    }));
  };

  const removeItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const addItem = () => {
    nextId++;
    setLineItems(prev => [...prev, { id: String(nextId), name: 'New Line Item', quantity: 1, unit_price: 0, total: 0 }]);
  };

  // Update a contingency field; label/rate/amount are canonical
  const updateContingency = (id: string, field: keyof Contingency, value: string | number) => {
    setContingencies(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: field === 'label' ? value : Number(value) || 0 } : c
    ));
  };

  const removeContingency = (id: string) => {
    setContingencies(prev => prev.filter(c => c.id !== id));
  };

  const addContingency = () => {
    nextId++;
    setContingencies(prev => [...prev, { id: String(nextId), label: 'Additional Cost', rate: null, amount: 0 }]);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:px-4 sm:py-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-2xl bg-white sm:border border-t border-[#E7E7E3] sm:rounded-[24px] rounded-t-[24px] flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        style={{ boxShadow: '0 8px 16px rgba(20,25,20,0.04), 0 24px 64px rgba(20,25,20,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E7E7E3] shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-[#171817]">Edit Quote</h2>
            <p className="text-[12px] text-[#6F716E] mt-0.5">{clientName} · {eventName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F0F0EE] transition-colors text-[#6F716E]">
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-5">
          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-[#171817]">Line Items</h3>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-[#19D66B] hover:text-[#079A4F] transition-colors"
              >
                <Icon name="PlusCircleIcon" size={14} />
                Add item
              </button>
            </div>

            {/* Column headers — hidden on very small screens */}
            <div className="hidden sm:grid grid-cols-12 gap-2 mb-1.5 px-1">
              <span className="col-span-5 text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">Name</span>
              <span className="col-span-2 text-[10px] font-semibold text-[#999C98] uppercase tracking-wider text-center">Qty</span>
              <span className="col-span-3 text-[10px] font-semibold text-[#999C98] uppercase tracking-wider text-right">Unit Price</span>
              <span className="col-span-2 text-[10px] font-semibold text-[#999C98] uppercase tracking-wider text-right">Total</span>
            </div>

            {/* Desktop grid rows */}
            <div className="hidden sm:block space-y-2">
              {lineItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center group">
                  <input
                    className="col-span-5 px-2.5 py-1.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-lg text-[12px] text-[#171817] outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                    value={item.name}
                    onChange={e => updateItem(item.id, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    className="col-span-2 px-2 py-1.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-lg text-[12px] text-[#171817] text-center outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                    value={item.quantity}
                    min={1}
                    onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                  />
                  <input
                    type="number"
                    className="col-span-3 px-2 py-1.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-lg text-[12px] text-[#171817] text-right outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                    value={item.unit_price}
                    min={0}
                    onChange={e => updateItem(item.id, 'unit_price', e.target.value)}
                  />
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <span className="text-[12px] font-semibold text-[#171817]">{formatNGN(item.quantity * item.unit_price)}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[#999C98] hover:text-red-500 transition-all ml-1"
                    >
                      <Icon name="TrashIcon" size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile stacked rows */}
            <div className="sm:hidden space-y-3">
              {lineItems.map((item) => (
                <div key={item.id} className="bg-[#FAFAF9] border border-[#E7E7E3] rounded-[14px] p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      className="flex-1 px-2.5 py-1.5 bg-white border border-[#E7E7E3] rounded-lg text-[13px] text-[#171817] outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                      value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Name"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-[#999C98] hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                    >
                      <Icon name="TrashIcon" size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">Qty</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-[#E7E7E3] rounded-lg text-[13px] text-[#171817] outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                        value={item.quantity}
                        min={1}
                        onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#999C98] uppercase tracking-wider">Unit Price</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-[#E7E7E3] rounded-lg text-[13px] text-[#171817] outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                        value={item.unit_price}
                        min={0}
                        onChange={e => updateItem(item.id, 'unit_price', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#999C98]">Subtotal</span>
                    <span className="text-[13px] font-bold text-[#171817]">{formatNGN(item.quantity * item.unit_price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between py-2 border-t border-[#E7E7E3]">
            <span className="text-[13px] text-[#6F716E]">Subtotal</span>
            <span className="text-[13px] font-semibold text-[#171817]">{formatNGN(subtotal)}</span>
          </div>

          {/* Contingencies — canonical label/rate/amount fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-[#171817]">Contingencies</h3>
              <button
                onClick={addContingency}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-[#19D66B] hover:text-[#079A4F] transition-colors"
              >
                <Icon name="PlusCircleIcon" size={14} />
                Add contingency
              </button>
            </div>

            {contingencies.length === 0 && (
              <p className="text-[12px] text-[#999C98] italic">No contingencies added.</p>
            )}

            {/* Desktop contingency rows */}
            <div className="hidden sm:block space-y-2">
              {contingencies.map((c) => (
                <div key={c.id} className="grid grid-cols-12 gap-2 items-center group">
                  <input
                    className="col-span-8 px-2.5 py-1.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-lg text-[12px] text-[#171817] outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                    value={c.label}
                    onChange={e => updateContingency(c.id, 'label', e.target.value)}
                    placeholder="Label"
                  />
                  <input
                    type="number"
                    className="col-span-3 px-2 py-1.5 bg-[#FAFAF9] border border-[#E7E7E3] rounded-lg text-[12px] text-[#171817] text-right outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                    value={c.amount}
                    min={0}
                    onChange={e => updateContingency(c.id, 'amount', e.target.value)}
                    placeholder="Amount"
                  />
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => removeContingency(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[#999C98] hover:text-red-500 transition-all"
                    >
                      <Icon name="TrashIcon" size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile contingency rows */}
            <div className="sm:hidden space-y-2">
              {contingencies.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <input
                    className="flex-1 px-2.5 py-2 bg-[#FAFAF9] border border-[#E7E7E3] rounded-lg text-[13px] text-[#171817] outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                    value={c.label}
                    onChange={e => updateContingency(c.id, 'label', e.target.value)}
                    placeholder="Label"
                  />
                  <input
                    type="number"
                    className="w-28 px-2.5 py-2 bg-[#FAFAF9] border border-[#E7E7E3] rounded-lg text-[13px] text-[#171817] text-right outline-hidden focus:border-[#19D66B] focus:ring-1 focus:ring-[#19D66B]/20 transition-all"
                    value={c.amount}
                    min={0}
                    onChange={e => updateContingency(c.id, 'amount', e.target.value)}
                  />
                  <button
                    onClick={() => removeContingency(c.id)}
                    className="p-1.5 rounded-lg text-[#999C98] hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                  >
                    <Icon name="TrashIcon" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#F0FFF6] border border-[#19D66B]/20 rounded-[16px] px-4 sm:px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#6F716E]">Quote Total</p>
              <p className="text-[11px] text-[#999C98] mt-0.5 hidden sm:block">
                Subtotal {formatNGN(subtotal)} + Contingencies {formatNGN(contingencyTotal)}
              </p>
            </div>
            <span className="text-[22px] sm:text-[26px] font-bold text-[#19D66B]">{formatNGN(total)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-t border-[#E7E7E3] shrink-0 bg-[#FAFAF9] rounded-b-[24px]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-[#E7E7E3] bg-white text-[#171817] text-[13px] font-semibold rounded-xl hover:bg-[#F0F0EE] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#19D66B] text-white text-[13px] font-bold rounded-xl hover:bg-[#079A4F] transition-colors"
            style={{ boxShadow: '0 0 0 1px rgba(25,214,107,0.2), 0 4px 24px rgba(25,214,107,0.15)' }}
          >
            <Icon name="CheckIcon" size={14} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
