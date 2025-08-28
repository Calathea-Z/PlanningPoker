// hooks/useRoomEvents.ts
import { useEffect, useRef } from 'react';
import { getConnection, ensureConnected } from '../realtime';
import type { RoomState } from '../types/RoomState';

export function useRoomEvents({
  room,
  setRoom,
}: {
  room: RoomState | null | undefined;
  setRoom: (next: RoomState) => void;
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

    // New countdown event
    conn.on('countdown_started', (countdownValue: number) => {
      const prev = roomRef.current;
      if (!prev) return;
      setRoom({ ...prev, countdown: countdownValue });
    });

    // New countdown update event
    conn.on('countdown_updated', (countdownValue: number | null) => {
      const prev = roomRef.current;
      if (!prev) return;
      setRoom({ ...prev, countdown: countdownValue });
    });

    conn.on('revealed', (votes: Record<string, number | null>) => {
      const prev = roomRef.current;
      if (!prev) return;
      setRoom({ ...prev, votes, revealed: true, countdown: null });
    });

    conn.on('round_reset', () => {
      const prev = roomRef.current;
      if (!prev) return;
      setRoom({ ...prev, votes: {}, revealed: false, issueKey: null, countdown: null });
    });

    ensureConnected().catch(err => console.error('SignalR start failed:', err));
    return () => {
      conn.off('room_state');
      conn.off('player_voted');
      conn.off('issue_attached');
      conn.off('countdown_started');
      conn.off('countdown_updated');
      conn.off('revealed');
      conn.off('round_reset');
    };
  }, [setRoom]);
}