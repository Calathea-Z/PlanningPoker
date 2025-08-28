import { useEffect, useRef } from 'react';
import { triggerConsensusConfetti } from '../utils/confetti';
import type { RoomState } from '../types/RoomState';

export function useConsensus(room: RoomState | undefined) {
  const lastVotesRef = useRef<Record<string, number | null>>({});
  const hasTriggeredConfettiRef = useRef(false);

  useEffect(() => {
    if (!room || !room.revealed || !room.votes) return;

    const currentVotes = room.votes;
    const numericVotes = Object.values(currentVotes).filter((v): v is number => v !== null);

    // Only check for consensus if we have votes and they're different from last time
    if (numericVotes.length === 0 || JSON.stringify(currentVotes) === JSON.stringify(lastVotesRef.current)) {
      return;
    }

    // Check if all numeric votes are the same (consensus)
    const uniqueVotes = new Set(numericVotes);
    const hasConsensus = uniqueVotes.size === 1 && numericVotes.length >= 2;

    // Only trigger confetti once per reveal round
    if (hasConsensus && !hasTriggeredConfettiRef.current) {
      triggerConsensusConfetti();
      hasTriggeredConfettiRef.current = true;
    }

    // Update refs
    lastVotesRef.current = currentVotes;
  }, [room?.votes, room?.revealed]);

  // Reset confetti trigger when round resets
  useEffect(() => {
    if (!room?.revealed) {
      hasTriggeredConfettiRef.current = false;
      lastVotesRef.current = {};
    }
  }, [room?.revealed]);
}