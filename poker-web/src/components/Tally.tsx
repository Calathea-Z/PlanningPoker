export default function Tally({ value }: { value: number }) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-2 text-center shadow-lg">
      <div className="text-xs text-green-100 mb-1">Team Average</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}