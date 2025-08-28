import { FIB_DECK } from '../utils/fibDeck';
import { vote } from '../services/roomActions';
import { useUI } from '../store';
import type { RoomState } from '../types/RoomState';

export default function VotingDeck({ 
  roomCode, 
  room 
}: { 
  roomCode: string;
  room: RoomState;
}) {
  const { me } = useUI();
  
  // Check if current user is a spectator
  const isSpectator: boolean = !!(me && room.players[me.connectionId]?.observer);

  return (
    <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-200 text-base">Vote Cards</h3>
        {isSpectator && (
          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
            Spectator Mode
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 h-[calc(100%-3rem)]">
        {FIB_DECK.map(v => (
          <button 
            key={v} 
            onClick={() => { if (!isSpectator) vote(roomCode, v); }}
            disabled={isSpectator}
            className={`bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 shadow-xl rounded-xl text-lg font-bold text-slate-200 flex items-center justify-center transition-all duration-300 transform ${
              isSpectator 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1 hover:scale-105'
            }`}
            title={isSpectator ? 'Spectators cannot vote' : `Vote ${v}`}
          >
            {v}
          </button>
        ))}
        <button 
          onClick={() => { if (!isSpectator) vote(roomCode, null); }}
          disabled={isSpectator}
          className={`bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 shadow-xl rounded-xl text-lg font-bold text-slate-200 flex items-center justify-center transition-all duration-300 transform ${
            isSpectator 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1 hover:scale-105'
          }`}
          title={isSpectator ? 'Spectators cannot vote' : "Vote 'I don't know'"}
        >
          ?
        </button>
      </div>
    </section>
  );
}