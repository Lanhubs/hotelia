import React from 'react';
import { PanelLeftClose, PanelLeftOpen, MoreHorizontal } from 'lucide-react';
import { Tooltip } from './Tooltip';
import keoLogo from '../../assets/keo-logo.png';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggle,
  isMobile = false,
  onCloseMobile,
}) => {
  return (
    <div
      id="sidebar-header"
      className={`h-16 flex items-center px-4 transition-all duration-200 ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        {/* KEO Experience Logo */}
        <div className="shrink-0 flex items-center justify-center">
          <img
            src={keoLogo}
            alt="KEO Experience"
            className="h-8 w-auto object-contain brightness-0"
          />
        </div>
      </div>

      {/* Header Actions */}
      {!isCollapsed && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Options"
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {!isMobile && (
            <button
              id="sidebar-toggle-btn"
              type="button"
              onClick={onToggle}
              aria-label="Collapse navigation"
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* When Collapsed, show toggle icon only */}
      {isCollapsed && !isMobile && (
        <Tooltip content="Expand navigation" enabled={isCollapsed} position="right">
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand navigation"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors mt-2 cursor-pointer"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </Tooltip>
      )}

      {/* Mobile Close Button */}
      {isMobile && onCloseMobile && (
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 focus:outline-none cursor-pointer"
        >
          <span className="text-lg leading-none">&times;</span>
        </button>
      )}
    </div>
  );
};
