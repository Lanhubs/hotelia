import React, { useEffect } from 'react';
import { useSidebarStore } from '../../stores/sidebarStore';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarUser } from './SidebarUser';

export const MobileDrawer: React.FC = () => {
  const { isMobileOpen, closeMobile } = useSidebarStore();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, closeMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  if (!isMobileOpen) return null;

  return (
    <div
      id="mobile-drawer-root"
      className="fixed inset-0 z-50 md:hidden flex"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="relative flex flex-col w-[280px] max-w-[85vw] h-full bg-white text-zinc-700 border-r border-zinc-200 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        <SidebarHeader
          isCollapsed={false}
          onToggle={closeMobile}
          isMobile={true}
          onCloseMobile={closeMobile}
        />
        <SidebarNavigation isCollapsed={false} onItemClick={closeMobile} />
        <SidebarUser isCollapsed={false} />
      </div>
    </div>
  );
};
