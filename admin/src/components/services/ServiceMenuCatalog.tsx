import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { ServiceMenuItem } from '../../data/servicesData';
import { DisplayCurrency, formatMoney } from '../bookings/bookingUtils';

interface ServiceMenuCatalogProps {
  items: ServiceMenuItem[];
  displayCurrency: DisplayCurrency;
  onOrderItem: (item: ServiceMenuItem) => void;
}

export const ServiceMenuCatalog: React.FC<ServiceMenuCatalogProps> = ({
  items,
  displayCurrency,
  onOrderItem,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Category Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                {item.categoryLabel}
              </span>
              {item.popular && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black uppercase">
                  Popular
                </span>
              )}
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <h3 className="font-bold text-sm leading-tight drop-shadow-sm">{item.name}</h3>
              <span className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> Prep Time: {item.prepTime}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            <p className="text-xs text-zinc-500 leading-relaxed">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 block">Rate / Price</span>
                <strong className="text-base font-black text-zinc-900">
                  {formatMoney(item.priceUSD, displayCurrency)}
                </strong>
              </div>

              <button
                type="button"
                onClick={() => onOrderItem(item)}
                className="px-3.5 py-2 bg-ink hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Order for Suite</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};