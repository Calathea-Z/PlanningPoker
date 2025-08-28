import { FIB_DECK } from '../utils/fibDeck';
import { vote } from '../services/roomActions';

export default function VotingDeck({ roomCode }: { roomCode: string }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {FIB_DECK.map(v => (
        <button 
          key={v} 
          onClick={() => vote(roomCode, v)}
          className="aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 hover:border-blue-400 shadow-xl hover:shadow-2xl rounded-2xl text-2xl font-bold text-slate-200 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
          title={`Vote ${v}`}
        >
          {v}
        </button>
      ))}
      <button 
        onClick={() => vote(roomCode, null)}
        className="aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 hover:border-blue-400 shadow-xl hover:shadow-2xl rounded-2xl text-2xl font-bold text-slate-200 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
        title="Vote 'I don't know'"
      >
        ?
      </button>
    </section>
  );
}
