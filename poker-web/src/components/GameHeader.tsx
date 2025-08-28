interface GameHeaderProps {
  roomCode: string
  playerName: string
  onReveal: () => void
  onReset: () => void
  canReveal: boolean
}

export default function GameHeader({ 
  roomCode, 
  playerName, 
  onReveal, 
  onReset, 
  canReveal 
}: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">Room {roomCode}</h2>
        <p className="text-sm text-gray-500">Hello, {playerName}</p>
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-2 border rounded"
          onClick={onReveal}
          disabled={!canReveal}
          title={!canReveal ? 'Need at least one vote' : 'Reveal votes'}
        >
          Reveal
        </button>
        <button className="px-3 py-2 border rounded" onClick={onReset}>
          Reset
        </button>
      </div>
    </header>
  )
}
