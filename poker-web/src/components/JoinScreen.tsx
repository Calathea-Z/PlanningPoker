import { useState } from 'react';
import { createRoom, joinRoom } from '../services/roomActions';

export default function JoinScreen({
  onSetMe, onSetCode,
}: {
  onSetMe: (name: string) => void;
  onSetCode: (code: string) => void;
}) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  async function handleNewRoom() {
    const newCode = await createRoom();
    if (!newCode) return alert('Failed to create room');
    setCode(newCode);
    onSetCode(newCode);
  }

  async function handleJoin() {
    if (!name || !code) return;
    onSetMe(name);
    await joinRoom(code, name, false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow rounded-2xl space-y-4">
        <h1 className="text-2xl font-semibold">Planning Poker</h1>

        <div className="space-y-2">
          <label className="block text-sm">Your name</label>
          <input className="w-full border rounded px-3 py-2"
                 value={name} onChange={e=>setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Room code</label>
          <div className="flex gap-2">
            <input className="flex-1 border rounded px-3 py-2 uppercase"
                   value={code} onChange={e=>setCode(e.target.value.toUpperCase())}/>
            <button className="px-3 py-2 border rounded" onClick={handleNewRoom}>New</button>
          </div>
        </div>

        <button className="w-full bg-black text-white rounded-lg py-2" onClick={handleJoin}>
          Join
        </button>

        <p className="text-xs text-gray-500">
          API should be at http://localhost:5083 (update vite.config.ts if different)
        </p>
      </div>
    </div>
  );
}
