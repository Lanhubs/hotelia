import React from 'react';
import { Search } from 'lucide-react';
import { useSidebarStore } from '../../stores/sidebarStore';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarUser } from './SidebarUser';

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <aside
      id="app-sidebar"
      aria-label="KEO Operations Sidebar"
      className={`hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-white text-zinc-700 border-r border-zinc-200/80 select-none z-30 transition-[width] duration-200 ease-in-out ${
        isCollapsed ? 'w-[72px]' : 'w-[220px]'
      }`}
    >
      {/* Header with Logo & Toggle Button */}
      <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleCollapse} />

      {/* Search Input on Sidebar */}
      {!isCollapsed && (
        <div className="px-3 pt-1 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-ink/30 focus:border-ink"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-mono font-medium">
              ⌘K
            </span>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <SidebarNavigation isCollapsed={isCollapsed} />

      {/* Footer User Account Area */}
      <SidebarUser isCollapsed={isCollapsed} />
    </aside>
  );
};
