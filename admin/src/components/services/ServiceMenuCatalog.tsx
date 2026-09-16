import React from 'react';
import { Clock, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { ServiceMenuItem } from '../../data/servicesData';
import { DisplayCurrency, formatMoney } from '../bookings/bookingUtils';

interface ServiceMenuCatalogProps {
  items: ServiceMenuItem[];
  displayCurrency: DisplayCurrency;
  onOrderItem: (item: ServiceMenuItem) => void;
  onEditItem?: (item: ServiceMenuItem) => void;
  onDeleteItem?: (item: ServiceMenuItem) => void;
  onAddItem?: () => void;
}

export const ServiceMenuCatalog: React.FC<ServiceMenuCatalogProps> = ({
  items,
  displayCurrency,
  onOrderItem,
  onEditItem,
  onDeleteItem,
  onAddItem,
}) => {
  const hasManagement = !!onAddItem;

  return (
    <div className="space-y-4">
      {/* Add Meal CTA */}
      {hasManagement && (
        <button
          type="button"
          onClick={onAddItem}
          className="w-full p-3 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-ink hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span className="text-xs font-bold">Upload New Meal / Menu Item</span>
        </button>
      )}

      {items.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-zinc-200 bg-white">
          <p className="text-sm font-semibold text-zinc-700">No menu items yet</p>
          <p className="text-xs text-zinc-400 mt-1">
            {hasManagement
              ? 'Upload your first meal or menu item to build your on-site restaurant menu.'
              : 'Menu items will appear here once added by the administrator.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-xs font-semibold">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                    {item.categoryLabel}
                  </span>
                  {(item.popular) && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black uppercase">
                      Popular
                    </span>
                  )}
                </div>

                {/* Management actions */}
                {(onEditItem || onDeleteItem) && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEditItem && (
                      <button
                        type="button"
                        onClick={() => onEditItem(item)}
                        title="Edit"
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-zinc-700 shadow-sm cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteItem && (
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item)}
                        title="Delete"
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-red-600 shadow-sm cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

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
                  {(item.tags || []).map((tag, idx) => (
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
      )}
    </div>
  );
};