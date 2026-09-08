import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem } from '../../types';
import { NavIcon } from './NavIcon';
import { Tooltip } from './Tooltip';

interface SidebarItemProps {
  item: NavigationItem;
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  onItemClick,
}) => {
  // Subscribe to location so the component re-renders on every route change
  const { pathname } = useLocation();
console.log(pathname)
  // Active when the current path starts with the item's path (handles nested routes)
  // Use exact match for dashboard to avoid it matching everything
  const isActive =
    item.path === '/dashboard'
      ? pathname === '/dashboard' || pathname === '/'
      : pathname.includes(item.path);

  const tooltipLabel = (
    <div className="flex items-center gap-2">
      <span className="font-medium text-xs">{item.label}</span>
    </div>
  );

  const linkContent = (
    <Link
      to={item.path}
      onClick={onItemClick}
      id={`nav-link-${item.id}`}
      className={`group relative flex items-center transition-all duration-150 outline-none rounded-xl ${
        isCollapsed
          ? 'w-10 h-10 justify-center mx-auto'
          : 'w-full px-3 py-2 gap-2.5 justify-start'
      } ${
        isActive
          ? 'bg-[#EEF2FF] text-ink font-semibold border border-indigo-100/80 shadow-2xs'
          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70 font-medium'
      }`}
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
        <NavIcon
          name={item.icon}
          className={`flex-shrink-0 w-4 h-4 transition-transform duration-150 ${
            isActive
              ? 'text-ink stroke-[2.2]'
              : 'text-zinc-400 group-hover:text-zinc-700 stroke-[1.8]'
          }`}
        />
        {!isCollapsed && (
          <span className="text-xs tracking-tight truncate">
            {item.label}
          </span>
        )}
      </div>
    </Link>
  );

  if (isCollapsed) {
    return (
      <li className="flex justify-center my-0.5 list-none">
        <Tooltip content={tooltipLabel} enabled={isCollapsed} position="right">
          {linkContent}
        </Tooltip>
      </li>
    );
  }

  return <li className="my-0.5 list-none">{linkContent}</li>;
};
