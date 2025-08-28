interface VoteCardProps {
  value: number | null
  onClick: (value: number | null) => void
  isQuestionMark?: boolean
}

export default function VoteCard({ value, onClick, isQuestionMark = false }: VoteCardProps) {
  return (
    <button
      onClick={() => onClick(value)}
      className="aspect-[3/4] rounded-2xl bg-white shadow hover:shadow-md border text-2xl font-bold flex items-center justify-center"
      title={isQuestionMark ? 'Vote "I don\'t know"' : `Vote ${value}`}
    >
      {isQuestionMark ? '?' : value}
    </button>
  )
}
