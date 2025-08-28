import { create } from 'zustand'
import type { UI } from './types/UI'

export const useUI = create<UI>((set) => ({
  setMe: (name) => set({ me: { name } }),
  setRoom: (room) => set({ room })
}))
