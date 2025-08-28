import type { Player } from '../types/Player'

interface PlayerCardProps {
  id: string
  player: Player
  voted: boolean
  voteValue: number | null | undefined
  shouldFlip: boolean
}

export default function PlayerCard({ id, player, voted, voteValue, shouldFlip }: PlayerCardProps) {
  return (
    <div
      className={`aspect-[3/4] rounded-2xl border-2 transition-all duration-700 ${
        voted ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
      } ${shouldFlip ? 'bg-blue-50 border-blue-300' : ''}`}
      style={{
        transform: shouldFlip ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      <div 
        className="h-full flex flex-col items-center justify-center p-4"
        style={{
          transform: shouldFlip ? 'rotateY(180deg)' : 'rotateY(0deg)',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="text-sm font-medium text-center mb-2">{player.name}</div>
        {voted && (
          <div className={`text-2xl font-bold ${
            shouldFlip ? 'text-blue-600' : 'text-green-600'
          }`}>
            {shouldFlip ? (voteValue ?? '?') : '✓'}
          </div>
        )}
        {!voted && (
          <div className="text-sm text-gray-500">Waiting...</div>
        )}
      </div>
    </div>
  )
}
