import { create } from "zustand";

type State = {
  content: string;
  getMedia: string;
  showEmoji: boolean;
  showGIF: boolean;
  setContent: (content: string) => void;
  setMedia: (media: string) => void;
  setShowEmoji: (show: boolean) => void;
  setShowGIF: (show: boolean) => void;
};

export const useStore = create<State>((set) => ({
  content: "",
  getMedia: "",
  showEmoji: false,
  showGIF: false,
  setContent: (content) => set((state) => ({ ...state, content })),
  setMedia: (media) => set((state) => ({ ...state, getMedia: media })),
  setShowEmoji: (show) => set((state) => ({ ...state, showEmoji: show })),
  setShowGIF: (show) => set((state) => ({ ...state, showGIF: show })),
}));
