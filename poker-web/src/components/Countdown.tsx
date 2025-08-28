export default function Countdown({ value }: { value: number }) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl text-center">
        <h4 className="font-semibold mb-3 text-yellow-300 text-lg">Revealing in...</h4>
        <div className="text-7xl font-bold text-yellow-400 drop-shadow-lg">{value}</div>
      </div>
    );
  }
  