import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, RotateCw, Bell, Lock, UserCheck, Building } from 'lucide-react';
import { useSidebarStore } from '../../stores/sidebarStore';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { SwitchRoleModal } from '../auth/SwitchRoleModal';
import { TopbarUserDropdown } from './TopbarUserDropdown';

interface TopbarProps {
  onNewBookingClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = () => {
  const { openMobile } = useSidebarStore();
  const { currentUser, lockTerminal, logout } = useAuthStore();
  const { unreadCount, isDrawerOpen, toggleDrawer, liveFeed, setLiveFeed } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isManager = currentUser.role === 'manager' || currentUser.role === 'admin';

  const getPageTitle = () => {
    const path = location.pathname.replace('/admin/', '');
    if (!path || path === 'dashboard') return 'Dashboard';
    if (path === 'bookings' || path === 'reservations') return 'Reservations';
    if (path === 'accommodation') return 'Accommodation';
    if (path === 'travel') return 'Travel Concierge';
    if (path === 'services' || path === 'catering') return 'Services';
    if (path === 'revenue' || path === 'reports') return 'Revenue';
    if (path === 'transactions' || path === 'accounting') return 'Accounting ';
    if (path === 'cashbooks') return 'Cash Books';
    if (path === 'settings') return 'Property Configuration';
    if (path === 'help') return 'Support & Staff Documentation';
    return path.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header
        id="app-topbar"
        className="sticky top-0 z-20 h-14 bg-white border-b border-zinc-200/80 px-4 md:px-6 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-trigger"
            type="button"
            onClick={openMobile}
            aria-label="Open mobile navigation menu"
            className="md:hidden p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 focus:outline-none cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-base md:text-lg font-bold text-zinc-900 tracking-tight">
              {getPageTitle()}
            </h1>

            <button
              onClick={() => setIsSwitchModalOpen(true)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                isManager
                  ? 'bg-indigo-50 text-ink border border-indigo-100 hover:bg-indigo-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Click to switch role between General Manager & Receptionist"
            >
              {isManager ? (
                <Building className="w-3 h-3 text-ink" />
              ) : (
                <UserCheck className="w-3 h-3 text-emerald-600" />
              )}
              <span>{isManager ? 'GM Role' : 'Receptionist'}</span>
              <span className="text-[10px] opacity-70 underline ml-0.5">Switch</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setLiveFeed(!liveFeed)}
            className={`hidden md:flex items-center gap-1.5 p-3 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              liveFeed
                ? 'bg-[#EEF4FE] text-[#3B82F6] border border-blue-200/60 hover:bg-blue-100/70'
                : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200/60'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${liveFeed ? 'animate-spin-slow' : ''}`} />
          </button>

          <button
            type="button"
            onClick={lockTerminal}
            title="Lock Terminal Screen"
            className="p-2 rounded-xl text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 border border-zinc-200/80 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Lock Terminal</span>
          </button>

          <button
            id="topbar-notifications-btn"
            type="button"
            aria-label="View notifications"
            aria-expanded={isDrawerOpen}
            onClick={toggleDrawer}
            className={`p-2 rounded-xl border transition-colors cursor-pointer relative ${
              isDrawerOpen
                ? 'bg-indigo-50 text-ink border-indigo-200'
                : 'text-zinc-500 hover:text-ink hover:bg-indigo-50 border-zinc-200/80'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-ink text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-zinc-200 ring-2 ring-white" />
            )}
          </button>

          <TopbarUserDropdown
            currentUser={currentUser}
            isManager={isManager}
            isOpen={isUserMenuOpen}
            onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
            onOpenSwitchModal={() => {
              setIsUserMenuOpen(false);
              setIsSwitchModalOpen(true);
            }}
            onLockTerminal={() => {
              setIsUserMenuOpen(false);
              lockTerminal();
            }}
            onSignOut={handleSignOut}
          />
        </div>
      </header>

      <SwitchRoleModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
      />
    </>
  );
};
