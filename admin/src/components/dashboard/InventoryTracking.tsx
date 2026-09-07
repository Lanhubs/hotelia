import React from 'react';
import { GripVertical } from 'lucide-react';
import { InventoryItem, TOTAL_INVENTORY } from '../../data/dashboardData';

interface InventoryTrackingProps {
  inventoryData: InventoryItem[];
}

export const InventoryTracking: React.FC<InventoryTrackingProps> = ({ inventoryData }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <GripVertical className="w-4 h-4 text-zinc-400 cursor-grab" />
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Inventory Tracking</h3>
          <p className="text-[10px] text-zinc-400 font-normal">Last updated 1m ago</p>
        </div>
      </div>

      {/* Total Metric */}
      <div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">{TOTAL_INVENTORY.count}</span>
          <span className="text-sm font-medium text-zinc-400 ml-1">/{TOTAL_INVENTORY.total}</span>
        </div>
        <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Total Items</p>
      </div>

      {/* Multi-color Segmented Progress Bar */}
      <div className="w-full flex items-center gap-1.5 h-3">
        {inventoryData.map((item, idx) => {
          const widthPct = (item.count / TOTAL_INVENTORY.total) * 100;
          return (
            <div
              key={idx}
              className="h-full rounded-sm"
              style={{ width: `${widthPct}%`, backgroundColor: item.color }}
              title={`${item.label}: ${item.count}`}
            />
          );
        })}
      </div>

      {/* Breakdown List */}
      <div className="space-y-2 pt-1 text-xs">
        {inventoryData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-xs"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-zinc-600">{item.label}</span>
            </div>
            <span className="font-bold text-zinc-900">
              {item.count}
              <span className="text-zinc-400 font-normal">/{item.total}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};