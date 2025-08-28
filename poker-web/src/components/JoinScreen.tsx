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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-2xl rounded-3xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Planning Poker
          </h1>
          <p className="text-slate-400 mt-2">Collaborative story point estimation</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Your name</label>
          <input 
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            placeholder="Enter your name"
            value={name} 
            onChange={e=>setName(e.target.value)} 
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Room code</label>
          <div className="flex gap-3">
            <input 
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-400 uppercase tracking-wider focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              placeholder="ROOM CODE"
              value={code} 
              onChange={e=>setCode(e.target.value.toUpperCase())}
            />
            <button 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={handleNewRoom}
            >
              New
            </button>
          </div>
        </div>

        <button 
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl py-4 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={handleJoin}
          disabled={!name || !code}
        >
          Join Room
        </button>

        <p className="text-xs text-slate-500 text-center">
          API should be at http://localhost:5083 (update vite.config.ts if different)
        </p>
      </div>
    </div>
  );
}
