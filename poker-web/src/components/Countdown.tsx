export default function Countdown({ value }: { value: number }) {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-2 text-center shadow-lg">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-orange-100">Get ready!</div>
    </div>
  );
}