import { useMemo, useCallback } from 'react';
import { useUI } from './store';
import { useRoomEvents } from './hooks/useRoomEvents';
import { useCountdown } from './hooks/useCountdown';
import { reveal as revealAction, resetRound as resetAction } from './services/roomActions';
import JoinScreen from './components/JoinScreen';
import HeaderControls from './components/HeaderControls';
import IssuePanel from './components/IssuePanel';
import VotingDeck from './components/VotingDeck';
import PlayersGrid from './components/PlayersGrid';
import Countdown from './components/Countdown';
import Tally from './components/Tally';
import type { RoomState } from './types/RoomState';

export default function App() {
  const { me, room, setMe, setRoom } = useUI();

  // Countdown (encapsulated)
  const [countdown, startCountdown, resetCountdown] = useCountdown();

  // Realtime events (keep hook order stable; normalize undefined → null)
  useRoomEvents({ room: room ?? null, setRoom });

  // Stable handlers (guard against room being null at call-time)
  const handleReveal = useCallback(async () => {
    if (!room) return;
    await revealAction(room.code);
    startCountdown(3);
  }, [room, startCountdown]);

  const handleReset = useCallback(async () => {
    if (!room) return;
    await resetAction(room.code);
    resetCountdown();
  }, [room, resetCountdown]);

  // ---- All hooks above this line. Derived values below are also hooks; keep them above any return. ----

  // Safe alias for TS and derived calculations (may be undefined before join)
  const r: RoomState | undefined = room ?? undefined;
  const meName = me?.name ?? '';

  // Derived UI state (memoized) - computed even pre-join, but harmlessly
  const revealed = r?.revealed ?? false;

  const voteCount = useMemo(
    () => Object.values(r?.votes ?? {}).length,
    [r?.votes]
  );

  const canReveal = useMemo(
    () => voteCount > 0 && !revealed && countdown === null,
    [voteCount, revealed, countdown]
  );

  const shouldShowCountdown = useMemo(
    () => countdown !== null && countdown > 0,
    [countdown]
  );

  const shouldFlipCards = useMemo(
    () => revealed && countdown === null,
    [revealed, countdown]
  );

  const tally = useMemo(() => {
    if (!revealed || !r) return 0;
    const numericVotes = Object.values(r.votes ?? {}).filter(
      (v): v is number => v !== null
    );
    if (!numericVotes.length) return 0;
    const avg = numericVotes.reduce((s, v) => s + v, 0) / numericVotes.length;
    return Math.round(avg * 10) / 10;
  }, [revealed, r]);

  // Decide which UI to render (but do NOT put hooks below this)
  const isJoined = !!(me && room);

  if (!isJoined) {
    return <JoinScreen onSetMe={setMe} onSetCode={() => {}} />;
  }

  // At this point r is defined at runtime (but we computed everything safely already)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <HeaderControls
          roomCode={r!.code}
          meName={meName}
          canReveal={canReveal}
          onReveal={handleReveal}
          onReset={handleReset}
        />

        <IssuePanel roomCode={r!.code} issueKey={r!.issueKey ?? null} revealed={revealed} />

        <VotingDeck roomCode={r!.code} />

        <section className="bg-white rounded-2xl p-4 shadow">
          <h3 className="font-medium mb-2">Players</h3>
          <PlayersGrid room={r!} shouldFlipCards={!!shouldFlipCards} />

          {shouldShowCountdown && countdown !== null && <Countdown value={countdown} />}
          {shouldFlipCards && <Tally value={tally} />}
        </section>
      </div>
    </div>
  );
}
