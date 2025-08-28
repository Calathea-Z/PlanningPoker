export default function Countdown({ value }: { value: number }) {
  return (
    <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl text-center">
      <h4 className="font-semibold mb-2 text-yellow-300 text-sm">Revealing in...</h4>
      <div className="text-3xl font-bold text-yellow-400 drop-shadow-lg">{value}</div>
    </div>
  );
}