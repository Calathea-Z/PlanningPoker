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
    <section className="bg-white p-4 rounded-2xl shadow space-y-3">
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2"
               placeholder="ISSUE-123" value={localKey}
               onChange={e=>setLocalKey(e.target.value)}/>
        <button className="px-3 py-2 border rounded" onClick={handleAttach}>
          Attach issue
        </button>
        {issueKey && (
          <span className="text-sm text-gray-600">
            Attached: <strong>{issueKey}</strong>
          </span>
        )}
      </div>

      {revealed && issueKey && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Commit:</span>
          <div className="flex flex-wrap gap-2">
            {FIB_DECK.map(v => (
              <button key={v} className="px-3 py-1 border rounded"
                      onClick={() => handleCommit(v)} title={`Set ${v} in Jira`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
