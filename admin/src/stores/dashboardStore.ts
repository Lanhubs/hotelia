import { create } from 'zustand';

export type RoomCategory = 'Suites' | 'Deluxe' | 'Single' | 'Double';
export type ChannelViewMode = 'overview' | 'profitability' | 'channels';

interface DashboardState {
  // UI State
  selectedRoomCategory: RoomCategory;
  selectedBar: number | null;
  timeRange: string;
  calendarWeek: string;
  channelViewMode: ChannelViewMode;
  
  // Dropdown visibility
  showTimeRangeDropdown: boolean;
  showWeekDropdown: boolean;
  
  // Actions
  setSelectedRoomCategory: (category: RoomCategory) => void;
  setSelectedBar: (index: number | null) => void;
  setTimeRange: (range: string) => void;
  setCalendarWeek: (week: string) => void;
  setChannelViewMode: (mode: ChannelViewMode) => void;
  setShowTimeRangeDropdown: (show: boolean) => void;
  setShowWeekDropdown: (show: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Initial state matching DashboardPage defaults
  selectedRoomCategory: 'Deluxe',
  selectedBar: 2,
  timeRange: 'Last 7 days',
  calendarWeek: 'Week 4',
  channelViewMode: 'overview',
  showTimeRangeDropdown: false,
  showWeekDropdown: false,
  
  // Actions
  setSelectedRoomCategory: (category) => set({ selectedRoomCategory: category }),
  setSelectedBar: (index) => set({ selectedBar: index }),
  setTimeRange: (range) => set({ timeRange: range, showTimeRangeDropdown: false }),
  setCalendarWeek: (week) => set({ calendarWeek: week, showWeekDropdown: false }),
  setChannelViewMode: (mode) => set({ channelViewMode: mode }),
  setShowTimeRangeDropdown: (show) => set({ showTimeRangeDropdown: show }),
  setShowWeekDropdown: (show) => set({ showWeekDropdown: show }),
}));