import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { ServiceOrder } from '../../data/servicesData';
import { DisplayCurrency, formatMoney } from '../bookings/bookingUtils';

const STAGES = ['Received', 'In Prep', 'Dispatched', 'Completed'] as const;

interface ServiceOperationsBoardProps {
  orders: ServiceOrder[];
  displayCurrency: DisplayCurrency;
  onOpenOrder: (order: ServiceOrder) => void;
  onAdvanceStatus: (orderId: string, currentStatus: ServiceOrder['status']) => void;
}

export const ServiceOperationsBoard: React.FC<ServiceOperationsBoardProps> = ({
  orders,
  displayCurrency,
  onOpenOrder,
  onAdvanceStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAGES.map((stage) => {
        const stageOrders = orders.filter((o) => o.status === stage);
        return (
          <div
            key={stage}
            className="bg-zinc-50/70 rounded-2xl p-3.5 border border-zinc-200/80 flex flex-col space-y-3 min-h-[450px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    stage === 'Received'
                      ? 'bg-amber-500'
                      : stage === 'In Prep'
                      ? 'bg-blue-500'
                      : stage === 'Dispatched'
                      ? 'bg-purple-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                  {stage === 'Received'
                    ? '1. Order Received'
                    : stage === 'In Prep'
                    ? '2. In Preparation'
                    : stage === 'Dispatched'
                    ? '3. Out for Delivery'
                    : '4. Completed & Billed'}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-700">
                {stageOrders.length}
              </span>
            </div>

            {/* Column Order Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {stageOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
                  No orders in this phase
                </div>
              ) : (
                stageOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => onOpenOrder(ord)}
                    className="p-4 bg-white rounded-xl border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    {/* Card Top: Ticket Code & Priority */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800">
                        {ord.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.priority === 'Urgent'
                            ? 'bg-red-100 text-red-800'
                            : ord.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {ord.priority}
                      </span>
                    </div>

                    {/* Guest & Room Tag */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">{ord.guestName}</h4>
                        <span className="text-[11px] font-semibold text-ink">
                          Suite #{ord.roomNumber}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-ink">
                        {ord.department}
                      </span>
                    </div>

                    {/* Items Preview */}
                    <div className="space-y-1 py-1.5 border-t border-b border-zinc-100 text-xs">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-zinc-700">
                          <span className="truncate pr-2">{i.quantity}x {i.name}</span>
                          <span className="font-semibold text-zinc-900 shrink-0">
                            {formatMoney(i.unitPrice * i.quantity, displayCurrency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Timing & Advance Action */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1 text-zinc-400 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{ord.scheduledTime}</span>
                      </div>

                      {stage !== 'Completed' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdvanceStatus(ord.id, ord.status);
                          }}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-ink text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Advance</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};