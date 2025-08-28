import { useState } from 'react'
import { useUI } from '../store'
import { ensureConnected } from '../realtime'

interface JoinScreenProps {
  onJoin?: () => void
}

export default function JoinScreen({ onJoin }: JoinScreenProps) {
  const { setMe, setRoom } = useUI()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

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
    console.log('Joining room:', code.toUpperCase(), 'as:', name)
    await c.invoke('JoinRoom', code.toUpperCase(), name, false)
    console.log('JoinRoom invoked, waiting for room_state event...')
  }

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
