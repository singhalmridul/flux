import { create } from 'zustand';

interface AppState {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    // Current view handling will be done via Router in Next.js, 
    // but we might need some global UI state for mobile/overlays.
}

export const useAppStore = create<AppState>((set) => ({
    isSidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
