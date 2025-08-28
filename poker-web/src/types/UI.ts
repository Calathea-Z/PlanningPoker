import type { RoomState } from "./RoomState"

export type UI = {
    me?: { name: string }
    room?: RoomState
    setMe: (n: string) => void
    setRoom: (r: RoomState) => void
  }