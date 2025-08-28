export default function Tally({ value }: { value: number }) {
  return (
    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl">
      <h4 className="font-semibold mb-2 text-blue-300 text-sm">Team Average</h4>
      <div className="text-2xl font-bold text-blue-400 drop-shadow-lg">{value}</div>
    </div>
  );
}