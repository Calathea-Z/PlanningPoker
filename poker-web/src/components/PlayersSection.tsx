import PlayerCard from './PlayerCard'
import CountdownTimer from './CountdownTimer'
import TeamAverage from './TeamAverage'
import type { RoomState } from '../types/RoomState'

interface PlayersSectionProps {
  room: RoomState
  shouldShowCountdown: boolean
  shouldFlipCards: boolean
  countdown: number | null
  average: number
  fibDeck: number[]
}

export default function PlayersSection({ 
  room, 
  shouldShowCountdown, 
  shouldFlipCards, 
  countdown, 
  average, 
  fibDeck 
}: PlayersSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow">
      <h3 className="font-medium mb-2">Players</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(room.players || {}).map(([id, p]) => {
          const voted = id in (room.votes || {})
          const val = room.votes?.[id]
          return (
            <PlayerCard
              key={id}
              id={id}
              player={p}
              voted={voted}
              voteValue={val}
              shouldFlip={shouldFlipCards}
            />
          )
        })}
      </div>

      {shouldShowCountdown && countdown && (
        <CountdownTimer countdown={countdown} />
      )}
      
      {shouldFlipCards && (
        <TeamAverage average={average} />
      )}
    </section>
  )
}
