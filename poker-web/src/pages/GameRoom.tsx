import { useState } from 'react'
import { useUI } from '../store'
import { ensureConnected } from '../realtime'
import GameHeader from '../components/GameHeader'
import IssueSection from '../components/IssueSection'
import VotingDeck from '../components/VotingDeck'
import PlayersSection from '../components/PlayersSection'

const FIB_DECK: number[] = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55]

export default function GameRoom() {
  const { me, room } = useUI()
  const [issueKey, setIssueKey] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)

  if (!me || !room) {
    return null
  }

  // Derived UI state
  const revealed = room.revealed
  const voteCount = Object.values(room.votes ?? {}).length
  const canReveal = voteCount > 0 && !revealed
  const shouldShowCountdown = countdown !== null && countdown > 0
  const shouldFlipCards = revealed && countdown === null

  const tally = revealed
    ? (() => {
        const numericVotes = Object.values(room.votes || {}).filter((v): v is number => v !== null)
        const average = numericVotes.length > 0 
          ? Math.round(numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length * 10) / 10
          : 0
        return average
      })()
    : 0

  async function attachIssue() {
    if (!room || !issueKey.trim()) return
    const c = await ensureConnected()
    await c.invoke('AttachIssue', room.code, issueKey.trim())
    setIssueKey('')
  }

  async function vote(v: number | null) {
    if (!room) return
    const c = await ensureConnected()
    await c.invoke('Vote', room.code, v)
  }

  async function reveal() {
    if (!room) return
    const c = await ensureConnected()
    await c.invoke('Reveal', room.code)
    
    // Start countdown
    setCountdown(3)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  async function resetRound() {
    if (!room) return
    const c = await ensureConnected()
    await c.invoke('ResetRound', room.code)
  }

  async function commitToJira(points: number) {
    if (!room || !room.issueKey) return
    const res = await fetch(`/api/rooms/${room.code}/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IssueKey: room.issueKey, FinalPoints: points }),
    })
    if (!res.ok) alert('Jira commit failed')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <GameHeader
          roomCode={room.code}
          playerName={me.name}
          onReveal={reveal}
          onReset={resetRound}
          canReveal={canReveal}
        />

        <IssueSection
          issueKey={issueKey}
          setIssueKey={setIssueKey}
          onAttachIssue={attachIssue}
          onCommitToJira={commitToJira}
          revealed={revealed}
          roomIssueKey={room.issueKey}
          fibDeck={FIB_DECK}
        />

        <VotingDeck
          fibDeck={FIB_DECK}
          onVote={vote}
        />

        <PlayersSection
          room={room}
          shouldShowCountdown={shouldShowCountdown}
          shouldFlipCards={shouldFlipCards}
          countdown={countdown}
          average={tally}
          fibDeck={FIB_DECK}
        />
      </div>
    </div>
  )
}
