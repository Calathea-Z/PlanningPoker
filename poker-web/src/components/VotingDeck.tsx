import { FIB_DECK } from '../utils/fibDeck';
import { vote } from '../services/roomActions';

export default function VotingDeck({ roomCode }: { roomCode: string }) {
  return (
    <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-4 shadow-2xl">
      <h3 className="font-semibold mb-3 text-slate-200 text-base">Vote Cards</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 h-[calc(100%-3rem)]">
        {FIB_DECK.map(v => (
          <button 
            key={v} 
            onClick={() => vote(roomCode, v)}
            className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 hover:border-blue-400 shadow-xl hover:shadow-2xl rounded-xl text-lg font-bold text-slate-200 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            title={`Vote ${v}`}
          >
            {v}
          </button>
        ))}
        <button 
          onClick={() => vote(roomCode, null)}
          className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 hover:border-blue-400 shadow-xl hover:shadow-2xl rounded-xl text-lg font-bold text-slate-200 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          title="Vote 'I don't know'"
        >
          ?
        </button>
      </div>
    </section>
  );
}