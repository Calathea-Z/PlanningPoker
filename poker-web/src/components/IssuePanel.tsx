import { useState } from "react";
import { attachIssue } from "../services/roomActions";

export default function IssuePanel({
  roomCode,
}: {
  roomCode: string;
}) {
  const [localKey, setLocalKey] = useState("");

  async function handleAttach(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const k = localKey.trim();
    if (!k) return;
    await attachIssue(roomCode, k);
    setLocalKey("");
  }

  return (
    <section className="h-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-4 shadow-xl flex flex-col">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-200">Issue Management</h3>

        {/* Input row */}
        <form onSubmit={handleAttach} className="flex items-stretch gap-2">
          <div className="flex-1">
            <label htmlFor="issueKey" className="sr-only">Issue key</label>
            <input
              id="issueKey"
              className="block w-full bg-slate-900/40 border border-slate-600/80 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 text-sm"
              placeholder="ISSUE-123"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              spellCheck={false}
              autoCapitalize="characters"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 px-3 py-2 rounded-xl bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium transition"
          >
            Attach
          </button>
        </form>
      </div>
    </section>
  );
}
