import React from 'react';
import { NAVIGATION_SECTIONS } from '../../data/navigation';
import { SidebarSection } from './SidebarSection';

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isCollapsed,
  onItemClick,
}) => {
  return (
    <nav
      id="sidebar-navigation"
      aria-label="Main Navigation"
      className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-1 custom-scrollbar"
    >
      {NAVIGATION_SECTIONS.map((section, idx) => (
        <SidebarSection
          key={section.key}
          section={section}
          isCollapsed={isCollapsed}
          isFirstSection={idx === 0}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
};
