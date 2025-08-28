import { useState } from 'react';
import { FIB_DECK } from '../utils/fibDeck';
import { attachIssue, commitToJira } from '../services/roomActions';

export default function IssuePanel({
  roomCode, issueKey, revealed,
}: {
  roomCode: string;
  issueKey: string | null;
  revealed: boolean;
}) {
  const [localKey, setLocalKey] = useState('');

  async function handleAttach() {
    const k = localKey.trim();
    if (!k) return;
    await attachIssue(roomCode, k);
    setLocalKey('');
  }

  async function handleCommit(v: number) {
    if (!issueKey) return;
    const ok = await commitToJira(roomCode, issueKey, v);
    if (!ok) alert('Jira commit failed');
  }

  return (
    <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex gap-3 items-center">
        <input 
          className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
          placeholder="ISSUE-123" 
          value={localKey}
          onChange={e=>setLocalKey(e.target.value)}
        />
        <button 
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={handleAttach}
        >
          Attach Issue
        </button>
        {issueKey && (
          <span className="text-sm text-slate-300 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600">
            Attached: <strong className="text-blue-400">{issueKey}</strong>
          </span>
        )}
      </div>

      {revealed && issueKey && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300 font-medium">Commit:</span>
          <div className="flex flex-wrap gap-2">
            {FIB_DECK.map(v => (
              <button 
                key={v} 
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 hover:border-blue-400 text-slate-200 font-medium rounded-lg transition-all duration-200 hover:bg-slate-600/50 transform hover:-translate-y-0.5"
                onClick={() => handleCommit(v)} 
                title={`Set ${v} in Jira`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
