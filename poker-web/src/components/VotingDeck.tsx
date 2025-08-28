import { FIB_DECK } from '../utils/fibDeck';
import { vote } from '../services/roomActions';

export default function VotingDeck({ roomCode }: { roomCode: string }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {FIB_DECK.map(v => (
        <button key={v} onClick={() => vote(roomCode, v)}
                className="aspect-[3/4] rounded-2xl bg-white shadow hover:shadow-md border text-2xl font-bold flex items-center justify-center"
                title={`Vote ${v}`}>
          {v}
        </button>
      ))}
      <button onClick={() => vote(roomCode, null)}
              className="aspect-[3/4] rounded-2xl bg-white shadow hover:shadow-md border text-2xl font-bold flex items-center justify-center"
              title="Vote 'I don't know'">
        ?
      </button>
    </section>
  );
}
