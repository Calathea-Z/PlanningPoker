import { useEffect, useRef } from 'react';
import { getConnection, ensureConnected } from '../realtime';
import { useUI } from '../store';
import type { RoomState } from '../types/RoomState';

export function useRoomEvents({
  room,
  setRoom,
}: {
  room: RoomState | null | undefined;
  setRoom: (next: RoomState) => void;
}) {
  const roomRef = useRef<RoomState | null>(room ?? null);
  const { me, setMe } = useUI();
  
  useEffect(() => { roomRef.current = room ?? null; }, [room]);

  useEffect(() => {
    const conn = getConnection('');

    conn.on('room_state', (state: RoomState) => {
      setRoom(state);
      
      // Update connectionId if we don't have it yet
      if (me && !me.connectionId) {
        // Find our player in the room state
        const ourPlayer = Object.entries(state.players).find(([_, player]) => 
          player.name === me.name
        );
        if (ourPlayer) {
          setMe(me.name, me.isSpectator, ourPlayer[0]); // connectionId
        }
      }
    });

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
  }, [setRoom, me, setMe]);
}