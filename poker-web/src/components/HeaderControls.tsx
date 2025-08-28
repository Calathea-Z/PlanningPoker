export default function HeaderControls({
    roomCode, canReveal, onReveal, onReset,
  }: {
    roomCode: string;
    canReveal: boolean;
    onReveal: () => void;
    onReset: () => void;
  }) {
    return (
      <header className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Room {roomCode}</h2>
          <p className="text-slate-400">Planning Poker Session</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={onReveal}
            disabled={!canReveal} 
            title={!canReveal ? 'Need at least one vote' : 'Reveal votes'}
          >
            Reveal
          </button>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </header>
    );
  }
  