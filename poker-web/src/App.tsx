import { useEffect, useMemo, useState } from 'react'
import { useUI } from './store'
import { getConnection, ensureConnected } from './realtime'

const FIB_DECK: number[] = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55]

export default function App() {
  const { me, room, setMe, setRoom } = useUI()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [issueKey, setIssueKey] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)

  // Build (or get) a single connection instance
  const conn = useMemo(() => getConnection(''), [])

  useEffect(() => {
    conn.on('room_state', (state) => setRoom(state))

    conn.on('player_voted', (connId: string) => {
      if (room) setRoom({ ...room, votes: { ...(room.votes ?? {}), [connId]: null } })
    })

    conn.on('issue_attached', (k: string) => {
      if (room) setRoom({ ...room, issueKey: k })
    })
    conn.on('revealed', (votes: Record<string, number | null>) => {
      if (room) setRoom({ ...room, votes, revealed: true })
    })
    conn.on('round_reset', () => {
      if (room) setRoom({ ...room, votes: {}, revealed: false, issueKey: null })
    })

    ensureConnected().catch(err => console.error('SignalR start failed:', err))
    return () => {
      conn.off('room_state')
      conn.off('player_voted')
      conn.off('issue_attached')
      conn.off('revealed')
      conn.off('round_reset')
    }
  }, [conn, setRoom, room])

  async function createRoom() {
    const res = await fetch('/api/rooms', { method: 'POST' })
    if (!res.ok) {
      alert('Failed to create room')
      return
    }
    const { code } = await res.json()
    setCode(code)
  }

  async function join() {
    if (!name || !code) return
    setMe(name)
    const c = await ensureConnected()
    await c.invoke('JoinRoom', code.toUpperCase(), name, false)
  }

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

  // Join screen
  if (!me || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white shadow rounded-2xl space-y-4">
          <h1 className="text-2xl font-semibold">Planning Poker</h1>

          <div className="space-y-2">
            <label className="block text-sm">Your name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm">Room code</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2 uppercase"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <button className="px-3 py-2 border rounded" onClick={createRoom}>
                New
              </button>
            </div>
          </div>

          <button className="w-full bg-black text-white rounded-lg py-2" onClick={join}>
            Join
          </button>

          <p className="text-xs text-gray-500">
            API should be at http://localhost:5083 (update vite.config.ts if different)
          </p>
        </div>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Room {room.code}</h2>
            <p className="text-sm text-gray-500">Hello, {me.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 border rounded"
              onClick={reveal}
              disabled={!canReveal}
              title={!canReveal ? 'Need at least one vote' : 'Reveal votes'}
            >
              Reveal
            </button>
            <button className="px-3 py-2 border rounded" onClick={resetRound}>
              Reset
            </button>
          </div>
        </header>

        {/* Issue attach + Commit after reveal */}
        <section className="bg-white p-4 rounded-2xl shadow space-y-3">
          <div className="flex gap-2">
            <input
              className="border rounded px-3 py-2"
              placeholder="ISSUE-123"
              value={issueKey}
              onChange={(e) => setIssueKey(e.target.value)}
            />
            <button className="px-3 py-2 border rounded" onClick={attachIssue}>
              Attach issue
            </button>
            {room.issueKey && (
              <span className="text-sm text-gray-600">
                Attached: <strong>{room.issueKey}</strong>
              </span>
            )}
          </div>

          {revealed && room.issueKey && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Commit:</span>
              <div className="flex flex-wrap gap-2">
                {FIB_DECK.map((v) => (
                  <button
                    key={v}
                    className="px-3 py-1 border rounded"
                    onClick={() => commitToJira(v)}
                    title={`Set ${v} in Jira`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Vote deck */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FIB_DECK.map((v) => (
            <button
              key={v}
              onClick={() => vote(v)}
              className="aspect-[3/4] rounded-2xl bg-white shadow hover:shadow-md border text-2xl font-bold flex items-center justify-center"
              title={`Vote ${v}`}
            >
              {v}
            </button>
          ))}
          {/* "?" vote */}
          <button
            onClick={() => vote(null)}
            className="aspect-[3/4] rounded-2xl bg-white shadow hover:shadow-md border text-2xl font-bold flex items-center justify-center"
            title="Vote 'I don't know'"
          >
            ?
          </button>
        </section>

        {/* Players & Tally */}
        <section className="bg-white rounded-2xl p-4 shadow">
          <h3 className="font-medium mb-2">Players</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(room.players || {}).map(([id, p]) => {
              const voted = id in (room.votes || {})
              const val = room.votes?.[id]
              return (
                <div
                  key={id}
                  className={`aspect-[3/4] rounded-2xl border-2 transition-all duration-700 ${
                    voted ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
                  } ${shouldFlipCards ? 'bg-blue-50 border-blue-300' : ''}`}
                  style={{
                    transform: shouldFlipCards ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div 
                    className="h-full flex flex-col items-center justify-center p-4"
                    style={{
                      transform: shouldFlipCards ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="text-sm font-medium text-center mb-2">{p.name}</div>
                    {voted && (
                      <div className={`text-2xl font-bold ${
                        shouldFlipCards ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {shouldFlipCards ? (val ?? '?') : '✓'}
                      </div>
                    )}
                    {!voted && (
                      <div className="text-sm text-gray-500">Waiting...</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {shouldShowCountdown && countdown && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl text-center">
              <h4 className="font-medium mb-2 text-yellow-800">Revealing in...</h4>
              <div className="text-6xl font-bold text-yellow-600">
                {countdown}
              </div>
            </div>
          )}
          
          {shouldFlipCards && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-medium mb-2 text-blue-800">Team Average</h4>
              <div className="text-2xl font-bold text-blue-600">
                {tally}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
