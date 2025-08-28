import { useEffect, useState } from 'react';
import { EyeIcon, ClockIcon, UserIcon, TagIcon } from '@phosphor-icons/react';

type JiraTicketProps = {
  issueKey: string | null;
};

type JiraIssue = {
  key: string;
  summary: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  reporter: string;
  storyPoints: number;
  labels: string[];
  components: string[];
  created: string;
  updated: string;
};

export default function JiraTicket({ issueKey }: JiraTicketProps) {
  const [ticket, setTicket] = useState<JiraIssue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!issueKey) {
      setTicket(null);
      setError(null);
      return;
    }

    async function fetchIssue() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/jira/issue/${issueKey}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError(`Issue ${issueKey} not found in JIRA`);
          } else {
            setError('Failed to fetch issue from JIRA');
          }
          setTicket(null);
          return;
        }
        
        const data = await response.json();
        setTicket(data);
      } catch (err) {
        setError('Failed to connect to JIRA');
        setTicket(null);
      } finally {
        setLoading(false);
      }
    }

    fetchIssue();
  }, [issueKey]);

  if (!issueKey) {
    return (
      <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-3 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-slate-600 rounded"></div>
          <h3 className="font-semibold text-slate-200 text-sm">JIRA Ticket</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-slate-400 text-sm">No ticket attached</div>
          <div className="text-slate-500 text-xs mt-1">Attach a JIRA issue to see details</div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-3 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-blue-500 rounded animate-pulse"></div>
          <h3 className="font-semibold text-slate-200 text-sm">{issueKey}</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-slate-400 text-sm">Loading...</div>
        </div>
      </section>
    );
  }

  if (error || !ticket) {
    return (
      <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-3 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <h3 className="font-semibold text-slate-200 text-sm">{issueKey}</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-red-400 text-sm">{error || 'Failed to load issue'}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-3 shadow-2xl overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <h3 className="font-semibold text-slate-200 text-sm">{ticket.key}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            ticket.priority === 'High' ? 'bg-red-500/20 text-red-300' :
            ticket.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-green-500/20 text-green-300'
          }`}>
            {ticket.priority}
          </span>
        </div>

        {/* Summary */}
        <div className="mb-2">
          <h4 className="text-slate-100 text-sm font-medium line-clamp-2 leading-tight">
            {ticket.summary}
          </h4>
        </div>

        {/* Meta info */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <UserIcon className="w-3 h-3" />
            <span>Assignee: {ticket.assignee || 'Unassigned'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ClockIcon className="w-3 h-3" />
            <span>Story Points: {ticket.storyPoints || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <EyeIcon className="w-3 h-3" />
            <span>Status: {ticket.status}</span>
          </div>
        </div>

        {/* Labels */}
        {ticket.labels.length > 0 && (
          <div className="mt-auto">
            <div className="flex items-center gap-1 mb-1">
              <TagIcon className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">Labels:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {ticket.labels.slice(0, 3).map((label, index) => (
                <span 
                  key={index}
                  className="px-1.5 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600"
                >
                  {label}
                </span>
              ))}
              {ticket.labels.length > 3 && (
                <span className="px-1.5 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded-full border border-slate-600">
                  +{ticket.labels.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
