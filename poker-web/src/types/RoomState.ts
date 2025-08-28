import type { Player } from "./Player"

export type RoomState = {
    code: string
    issueKey?: string | null
    revealed: boolean
    players: Record<string, Player>
    votes: Record<string, number | null> // null = "?"
  }