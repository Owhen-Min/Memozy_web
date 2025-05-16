import { create } from "zustand";

interface ErrorOptions {
  showButtons?: boolean;
}

interface ErrorStore {
  error: string | null;
  isModalOpen: boolean;
  showButtons: boolean;
  setError: (error: string | null, options?: ErrorOptions) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  error: null,
  isModalOpen: false,
  showButtons: true,
  setError: (error, options = { showButtons: true }) =>
    set({
      error,
      isModalOpen: true,
      showButtons: options.showButtons ?? true,
    }),
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  clearError: () => {
    set({ error: null, isModalOpen: false });
  },
}));
