import { create } from 'zustand';

type Me = {
  name: string;
  connectionId: string;
  isSpectator: boolean;
};

type UIState = {
  me: Me | null;
  room: any | null;
  setMe: (name: string, isSpectator: boolean, connectionId?: string) => void;
  setRoom: (room: any) => void;
  clear: () => void;
};

export const useUI = create<UIState>((set) => ({
  me: null,
  room: null,
  setMe: (name: string, isSpectator: boolean, connectionId: string = '') => set({ 
    me: { name, connectionId, isSpectator } 
  }),
  setRoom: (room) => set({ room }),
  clear: () => set({ me: null, room: null }),
}));