export default function Tally({ value }: { value: number }) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl">
        <h4 className="font-semibold mb-3 text-blue-300 text-lg">Team Average</h4>
        <div className="text-4xl font-bold text-blue-400 drop-shadow-lg">{value}</div>
      </div>
    );
  }
  