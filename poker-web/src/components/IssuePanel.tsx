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
    <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-4 shadow-2xl flex flex-col">
      <h3 className="font-semibold mb-3 text-slate-200 text-base">Issue</h3>
      
      <div className="space-y-3 flex-1">
        {/* Input and Attach Button */}
        <div className="space-y-2">
          <input 
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
            placeholder="ISSUE-123" 
            value={localKey}
            onChange={e=>setLocalKey(e.target.value)}
          />
          <button 
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            onClick={handleAttach}
          >
            Attach Issue
          </button>
        </div>

        {/* Attached Issue Display */}
        {issueKey && (
          <div className="text-sm text-slate-300 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600">
            Attached: <strong className="text-blue-400">{issueKey}</strong>
          </div>
        )}

        {/* Commit Buttons */}
        {revealed && issueKey && (
          <div className="space-y-2">
            <span className="text-sm text-slate-300 font-medium">Commit:</span>
            <div className="grid grid-cols-3 gap-2">
              {FIB_DECK.slice(0, 9).map(v => (
                <button 
                  key={v} 
                  className="px-2 py-1 bg-slate-700/50 border border-slate-600 hover:border-blue-400 text-slate-200 font-medium rounded-lg transition-all duration-200 hover:bg-slate-600/50 transform hover:-translate-y-0.5 text-sm"
                  onClick={() => handleCommit(v)} 
                  title={`Set ${v} in Jira`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FIB_DECK.slice(9).map(v => (
                <button 
                  key={v} 
                  className="px-2 py-1 bg-slate-700/50 border border-slate-600 hover:border-blue-400 text-slate-200 font-medium rounded-lg transition-all duration-200 hover:bg-slate-600/50 transform hover:-translate-y-0.5 text-sm"
                  onClick={() => handleCommit(v)} 
                  title={`Set ${v} in Jira`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}