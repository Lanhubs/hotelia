import React from 'react';
import { X } from 'lucide-react';
import { ServiceOrder } from '../../data/servicesData';
import { DisplayCurrency, formatMoney } from '../bookings/bookingUtils';

interface ServiceOrderDrawerProps {
  order: ServiceOrder;
  displayCurrency: DisplayCurrency;
  onAdvance: (orderId: string, currentStatus: ServiceOrder['status']) => void;
  onClose: () => void;
}

export const ServiceOrderDrawer: React.FC<ServiceOrderDrawerProps> = ({
  order,
  displayCurrency,
  onAdvance,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-60 overflow-hidden flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-zinc-200 p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
              {order.id}
            </span>
            <h3 className="text-base font-bold text-zinc-900 mt-1">
              Service Ticket Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resident Information */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Resident Details</span>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-zinc-900">{order.guestName}</h4>
              <span className="text-xs text-ink font-semibold">
                Room #{order.roomNumber} ({order.vipTier} VIP)
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {order.status}
            </span>
          </div>
        </div>

        {/* Itemized Order Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-zinc-800">Ordered Menu Items</h4>
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 divide-y divide-zinc-200/80 text-xs">
            {order.items.map((it, idx) => (
              <div key={idx} className="py-2 flex justify-between">
                <div>
                  <span className="font-bold text-zinc-900">{it.quantity}x {it.name}</span>
                  {it.specialNotes && (
                    <p className="text-[11px] text-zinc-500 italic mt-0.5">{it.specialNotes}</p>
                  )}
                </div>
                <span className="font-black text-zinc-900">
                  {formatMoney(it.unitPrice * it.quantity, displayCurrency)}
                </span>
              </div>
            ))}
            <div className="pt-3 flex justify-between text-sm font-black text-zinc-900">
              <span>Total Amount</span>
              <span className="text-ink">{formatMoney(order.totalAmountUSD, displayCurrency)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Staff Assignment */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2 text-xs text-zinc-700">
          <div className="flex justify-between">
            <span>Assigned Staff:</span>
            <strong className="text-zinc-900">{order.assignedStaff}</strong>
          </div>
          <div className="flex justify-between">
            <span>Scheduled Time:</span>
            <strong className="text-zinc-900">{order.scheduledTime}</strong>
          </div>
          {order.orderNotes && (
            <div className="pt-2 border-t border-zinc-200">
              <span className="text-zinc-400 block font-medium">Delivery Notes:</span>
              <p className="text-zinc-800 mt-0.5">{order.orderNotes}</p>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-2 mt-auto">
          {order.status !== 'Completed' && (
            <button
              type="button"
              onClick={() => {
                onAdvance(order.id, order.status);
                onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              Advance to Next Stage
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};