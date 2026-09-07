import React from 'react';
import { NavigationSection } from '../../types';
import { SidebarItem } from './SidebarItem';

interface SidebarSectionProps {
  section: NavigationSection;
  isCollapsed: boolean;
  isFirstSection?: boolean;
  onItemClick?: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  isCollapsed,
  onItemClick,
}) => {
  return (
    <div className="flex flex-col py-1">
      {/* Section Title */}
      {!isCollapsed && section.title && (
        <span className="text-[11px] font-medium text-zinc-400 px-3 py-1 truncate">
          {section.title}
        </span>
      )}

      {/* Section Items */}
      <ul className="flex flex-col space-y-0.5 p-0 m-0">
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            onItemClick={onItemClick}
          />
        ))}
      </ul>
    </div>
  );
};
