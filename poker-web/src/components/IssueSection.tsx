interface IssueSectionProps {
  issueKey: string
  setIssueKey: (key: string) => void
  onAttachIssue: () => void
  onCommitToJira: (points: number) => void
  revealed: boolean
  roomIssueKey?: string | null
  fibDeck: number[]
}

export default function IssueSection({ 
  issueKey, 
  setIssueKey, 
  onAttachIssue, 
  onCommitToJira, 
  revealed, 
  roomIssueKey, 
  fibDeck 
}: IssueSectionProps) {
  return (
    <section className="bg-white p-4 rounded-2xl shadow space-y-3">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2"
          placeholder="ISSUE-123"
          value={issueKey}
          onChange={(e) => setIssueKey(e.target.value)}
        />
        <button className="px-3 py-2 border rounded" onClick={onAttachIssue}>
          Attach issue
        </button>
        {roomIssueKey && (
          <span className="text-sm text-gray-600">
            Attached: <strong>{roomIssueKey}</strong>
          </span>
        )}
      </div>

      {revealed && roomIssueKey && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Commit:</span>
          <div className="flex flex-wrap gap-2">
            {fibDeck.map((v) => (
              <button
                key={v}
                className="px-3 py-1 border rounded"
                onClick={() => onCommitToJira(v)}
                title={`Set ${v} in Jira`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
