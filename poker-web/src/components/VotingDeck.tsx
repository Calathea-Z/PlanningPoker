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
  const isSpectator = !!(me && room.players[me.connectionId]?.observer);

  return (
    <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-3 shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-200 text-sm">Vote Cards</h3>
        {isSpectator && (
          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
            Spectator Mode
          </span>
        )}
      </div>
      <div className="flex justify-center items-center h-[calc(100%-2rem)]">
        <div className="grid grid-cols-6 gap-2 max-w-2xl">
          {FIB_DECK.map(v => (
            <button 
              key={v} 
              onClick={() => !isSpectator && vote(roomCode, v)}
              disabled={isSpectator}
              className={`aspect-[2.5/3.5] w-16 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 shadow-lg rounded-lg text-sm font-bold text-slate-200 flex items-center justify-center transition-all duration-300 transform ${
                isSpectator 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 hover:scale-105'
              }`}
              title={isSpectator ? 'Spectators cannot vote' : `Vote ${v}`}
            >
              {v}
            </button>
          ))}
          <button 
            onClick={() => !isSpectator && vote(roomCode, null)}
            disabled={isSpectator}
            className={`aspect-[2.5/3.5] w-16 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 shadow-lg rounded-lg text-sm font-bold text-slate-200 flex items-center justify-center transition-all duration-300 transform ${
              isSpectator 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 hover:scale-105'
            }`}
            title={isSpectator ? 'Spectators cannot vote' : "Vote 'I don't know'"}
          >
            ?
          </button>
        </div>
      </div>
    </section>
  );
}