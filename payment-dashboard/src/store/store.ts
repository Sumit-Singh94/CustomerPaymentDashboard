import { create } from 'zustand';

interface AppState {
  selectedIds: string[];
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedIds: [],
  toggleSelection: (id) => set((state) => {
    const isSelected = state.selectedIds.includes(id);
    return {
      selectedIds: isSelected 
        ? state.selectedIds.filter((sid) => sid !== id) 
        : [...state.selectedIds, id]
    };
  }),
  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
}));