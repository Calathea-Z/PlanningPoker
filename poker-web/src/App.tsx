import { useMemo, useCallback } from 'react';
import { useUI } from './store';
import { useRoomEvents } from './hooks/useRoomEvents';
import { useConsensus } from './hooks/useConsensus';
import { reveal as revealAction, resetRound as resetAction } from './services/roomActions';
import Header from './components/Header';
import JoinScreen from './components/JoinScreen';
import HeaderControls from './components/HeaderControls';
import IssuePanel from './components/IssuePanel';
import JiraTicket from './components/JiraTicket';
import VotingDeck from './components/VotingDeck';
import PlayersGrid from './components/PlayersGrid';
import Countdown from './components/Countdown';
import Tally from './components/Tally';
import type { RoomState } from './types/RoomState';

export default function App() {
  const { me, room, setMe, setRoom } = useUI();

  useRoomEvents({ room: room ?? null, setRoom });
  useConsensus(room);

  // (guard against room being null at call-time)
  const handleReveal = useCallback(async () => {
    if (!room) return;
    await revealAction(room.code);
  }, [room]);

  const handleReset = useCallback(async () => {
    if (!room) return;
    await resetAction(room.code);
  }, [room]);

  const r: RoomState | undefined = room ?? undefined;
  const meName = me?.name ?? '';

  const revealed = r?.revealed ?? false;
  const countdown = r?.countdown ?? null;

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

  const isJoined = !!(me && room);

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header meName={meName} />
        <JoinScreen onSetMe={setMe} onSetCode={() => {}} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header meName={meName} />
      
      <div className="flex-1 p-3 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto flex flex-col gap-3">
          {/* Top Row: Header Controls and Issue Panel */}
          <div className="flex gap-3 h-36">
            <div className="flex-1">
              <HeaderControls
                roomCode={r!.code}
                canReveal={canReveal}
                onReveal={handleReveal}
                onReset={handleReset}
              />
            </div>
            <div className="w-80">
              <IssuePanel roomCode={r!.code} />
            </div>
          </div>

          {/* Main Content: Two columns */}
          <div className="flex-1 flex gap-3 min-h-0">
            {/* Left: JIRA Ticket and Voting Deck */}
            <div className="w-2/3 flex flex-col gap-3">
              {/* JIRA Ticket */}
              <div className="h-1/3">
                <JiraTicket issueKey={r!.issueKey ?? null} />
              </div>
              
              {/* Voting Deck */}
              <div className="h-2/3">
                <VotingDeck roomCode={r!.code} room={r!} />
              </div>
            </div>

            {/* Right: Players Section */}
            <div className="w-1/3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-3 shadow-2xl">
              <h3 className="font-semibold mb-2 text-slate-200 text-sm">Players</h3>
              <div className="space-y-2">
                <PlayersGrid room={r!} shouldFlipCards={!!shouldFlipCards} />
                
                {shouldShowCountdown && countdown !== null && (
                  <div className="mt-2">
                    <Countdown value={countdown} />
                  </div>
                )}
                
                {shouldFlipCards && (
                  <div className="mt-2">
                    <Tally value={tally} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
