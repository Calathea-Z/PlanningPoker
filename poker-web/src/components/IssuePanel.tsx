import { useState } from "react";
import { FIB_DECK } from "../utils/fibDeck";
import { attachIssue, commitToJira } from "../services/roomActions";

export default function IssuePanel({
  roomCode,
  issueKey,
  revealed,
}: {
  roomCode: string;
  issueKey: string | null;
  revealed: boolean;
}) {
  const [localKey, setLocalKey] = useState("");

  async function handleAttach(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const k = localKey.trim();
    if (!k) return;
    await attachIssue(roomCode, k);
    setLocalKey("");
  }

  async function handleCommit(v: number) {
    if (!issueKey) return;
    const ok = await commitToJira(roomCode, issueKey, v);
    if (!ok) alert("Jira commit failed");
  }

  return (
<section className="h-full min-w-0 max-w-full bg-slate-800/60 backdrop-blur-sm
  border border-slate-700/60 rounded-3xl p-4 shadow-xl flex flex-col
  overflow-hidden"> {/* <- clip children to the rounded card */}
  <div className="flex-1 min-h-0 flex flex-col gap-3 min-w-0">
    <h3 className="text-sm font-semibold text-slate-200">Issue Management</h3>

    {/* Input row */}
    <form onSubmit={handleAttach} className="flex items-stretch gap-2 min-w-0 max-w-full">
      <div className="flex-1 min-w-0 w-[1px]"> {/* <- the w-[1px] trick ensures flex-basis shrinks */}
        <label htmlFor="issueKey" className="sr-only">Issue key</label>
        <input
          id="issueKey"
          className="block w-full min-w-0 bg-slate-900/40 border border-slate-600/80
            rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none
            focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 text-sm"
          placeholder="Enter issue key (e.g., ISSUE-123)"
          value={localKey}
          onChange={(e) => setLocalKey(e.target.value)}
          spellCheck={false}
          autoCapitalize="characters"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 px-3 py-2 rounded-xl bg-slate-600 hover:bg-slate-500
          text-white text-sm font-medium transition"
      >
        Attach
      </button>
    </form>

    {issueKey && (
      <div className="min-w-0 rounded-xl border border-slate-600/60 bg-slate-900/30 px-3 py-2">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">Current Issue</div>
        <div className="text-sm font-medium text-blue-400 truncate">{issueKey}</div>
      </div>
    )}

    {revealed && issueKey && (
      <div className="mt-auto min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">Commit to JIRA</div>
        <div className="flex flex-wrap gap-1.5">
          {FIB_DECK.map((v) => (
            <button
              key={v}
              type="button"
              className="px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-600/70
                text-slate-100 text-sm hover:border-blue-400 hover:bg-slate-700/60 transition"
              onClick={() => handleCommit(v)}
              title={`Set ${v} in JIRA`}
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
