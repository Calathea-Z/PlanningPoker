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
    <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-3 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="mb-2">
          <h3 className="font-semibold text-slate-200 text-sm mb-2">JIRA Issue</h3>
          
          {/* Input Section */}
          <div className="space-y-2">
            <input 
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1.5 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all text-xs"
              placeholder="ISSUE-123" 
              value={localKey}
              onChange={e=>setLocalKey(e.target.value)}
            />
            <button 
              className="w-full px-2 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs"
              onClick={handleAttach}
            >
              Attach Issue
            </button>
          </div>
        </div>

        {/* Current Issue Display */}
        {issueKey && (
          <div className="mb-2 p-2 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <div className="text-xs text-slate-400 mb-1">Current Issue</div>
            <div className="text-xs font-medium text-blue-400 truncate">{issueKey}</div>
          </div>
        )}

        {/* Commit Section */}
        {revealed && issueKey && (
          <div className="mt-auto">
            <div className="text-xs text-slate-400 mb-1">Commit to Jira</div>
            <div className="grid grid-cols-3 gap-1 mb-1">
              {FIB_DECK.slice(0, 9).map(v => (
                <button 
                  key={v} 
                  className="px-1 py-1 bg-slate-700/50 border border-slate-600 hover:border-blue-400 text-slate-200 font-medium rounded text-xs transition-all duration-200 hover:bg-slate-600/50 transform hover:-translate-y-0.5"
                  onClick={() => handleCommit(v)} 
                  title={`Set ${v} in Jira`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {FIB_DECK.slice(9).map(v => (
                <button 
                  key={v} 
                  className="px-1 py-1 bg-slate-700/50 border border-slate-600 hover:border-blue-400 text-slate-200 font-medium rounded text-xs transition-all duration-200 hover:bg-slate-600/50 transform hover:-translate-y-0.5"
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