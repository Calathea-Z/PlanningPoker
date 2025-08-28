import VoteCard from './VoteCard'

interface VotingDeckProps {
  fibDeck: number[]
  onVote: (value: number | null) => void
}

export default function VotingDeck({ fibDeck, onVote }: VotingDeckProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {fibDeck.map((v) => (
        <VoteCard
          key={v}
          value={v}
          onClick={onVote}
        />
      ))}
      {/* "?" vote */}
      <VoteCard
        value={null}
        onClick={onVote}
        isQuestionMark={true}
      />
    </section>
  )
}
