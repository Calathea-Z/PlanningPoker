// hooks/useRoomEvents.ts
import { useEffect, useRef } from 'react';
import { getConnection, ensureConnected } from '../realtime';
import type { RoomState } from '../types/RoomState';

export function useRoomEvents({
  room,
  setRoom,
}: {
  room: RoomState | null | undefined;        // allow undefined/null in
  setRoom: (next: RoomState) => void;        // but never set null out
}) {
  const roomRef = useRef<RoomState | null>(room ?? null);
  useEffect(() => { roomRef.current = room ?? null; }, [room]);

  useEffect(() => {
    const conn = getConnection('');

    conn.on('room_state', (state: RoomState) => setRoom(state));

    conn.on('player_voted', (connId: string) => {
      const prev = roomRef.current;
      if (!prev) return;
      setRoom({ ...prev, votes: { ...(prev.votes ?? {}), [connId]: null } });
    });

    conn.on('issue_attached', (k: string) => {
      const prev = roomRef.current;
      if (!prev) return;
      setRoom({ ...prev, issueKey: k });
    });

    conn.on('revealed', (votes: Record<string, number | null>) => {
      const prev = roomRef.current;
      if (!prev) return;
      setRoom({ ...prev, votes, revealed: true });
    });

    conn.on('round_reset', () => {
      const prev = roomRef.current;
      if (!prev) return;
      setRoom({ ...prev, votes: {}, revealed: false, issueKey: null });
    });

    ensureConnected().catch(err => console.error('SignalR start failed:', err));
    return () => {
      conn.off('room_state');
      conn.off('player_voted');
      conn.off('issue_attached');
      conn.off('revealed');
      conn.off('round_reset');
    };
  }, [setRoom]);
}
