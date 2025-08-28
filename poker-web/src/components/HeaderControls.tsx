export default function HeaderControls({
  roomCode,
  canReveal,
  onReveal,
  onReset,
}: {
  roomCode: string;
  canReveal: boolean;
  onReveal: () => void;
  onReset: () => void;
}) {
  return (
    <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-4 shadow-2xl">
      <div className="h-full flex items-center justify-between">
        {/* Left: Room Info */}
        <div>
          <h2 className="text-xl font-bold text-slate-100">Room {roomCode}</h2>
          <p className="text-sm text-slate-400">Planning Poker Session</p>
        </div>
        
        {/* Right: Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReveal}
            disabled={!canReveal}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Reveal
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}