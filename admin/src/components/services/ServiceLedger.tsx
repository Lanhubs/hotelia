import React from 'react';
import { Eye } from 'lucide-react';
import { ServiceOrder } from '../../data/servicesData';
import { DisplayCurrency, formatMoney } from '../bookings/bookingUtils';

interface ServiceLedgerProps {
  orders: ServiceOrder[];
  displayCurrency: DisplayCurrency;
  totalRevenue: number;
  onOpenOrder: (order: ServiceOrder) => void;
}

const GRID_TEMPLATE =
  'grid-cols-[1.1fr_1.5fr_1.1fr_1.9fr_1fr_1fr_1.1fr_0.9fr]';

export const ServiceLedger: React.FC<ServiceLedgerProps> = ({
  orders,
  displayCurrency,
  totalRevenue,
  onOpenOrder,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Service Charges & Folio Postings</h2>
          <p className="text-xs text-zinc-400">
            All food & beverage, spa therapies, concierge charters, and room service transactions.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
          Total Billed: {formatMoney(totalRevenue, displayCurrency)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="w-full text-left text-xs text-zinc-600">
          {/* Header Row */}
          <div
            className={`grid ${GRID_TEMPLATE} bg-[#FAFBFD] text-zinc-400 border-b border-zinc-100 uppercase text-[10px] font-bold tracking-wider`}
          >
            <div className="py-3 px-4">Ticket / Code</div>
            <div className="py-3 px-4">Guest & Suite</div>
            <div className="py-3 px-4">Department</div>
            <div className="py-3 px-4">Service Details</div>
            <div className="py-3 px-4">Scheduled</div>
            <div className="py-3 px-4">Status</div>
            <div className="py-3 px-4">Total Amount</div>
            <div className="py-3 px-4 text-right">Actions</div>
          </div>

          {/* Data Rows */}
          <div className="divide-y divide-zinc-100">
            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => onOpenOrder(ord)}
                className={`grid ${GRID_TEMPLATE} hover:bg-zinc-50/80 transition-colors cursor-pointer`}
              >
                <div className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                  <span className="text-ink">{ord.id}</span>
                  <div className="text-[10px] text-zinc-400 font-normal">{ord.orderNumber}</div>
                </div>
                <div className="py-3.5 px-4">
                  <div className="font-bold text-zinc-900">{ord.guestName}</div>
                  <div className="text-[11px] font-semibold text-ink">
                    Suite #{ord.roomNumber} ({ord.vipTier} VIP)
                  </div>
                </div>
                <div className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-100 text-zinc-800">
                    {ord.department}
                  </span>
                </div>
                <div className="py-3.5 px-4">
                  <div className="font-semibold text-zinc-800">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                  {ord.dietaryAllergens && (
                    <div className="text-[10px] text-amber-600 font-medium">
                      ⚠ {ord.dietaryAllergens}
                    </div>
                  )}
                </div>
                <div className="py-3.5 px-4 text-zinc-700 font-medium">
                  {ord.scheduledTime}
                </div>
                <div className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ord.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'Dispatched'
                        ? 'bg-purple-100 text-purple-800'
                        : ord.status === 'In Prep'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
                <div className="py-3.5 px-4 font-black text-zinc-900">
                  {formatMoney(ord.totalAmountUSD, displayCurrency)}
                  <div className="text-[10px] text-emerald-600 font-semibold">Billed to Folio</div>
                </div>
                <div className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenOrder(ord);
                    }}
                    className="px-2.5 py-1 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};