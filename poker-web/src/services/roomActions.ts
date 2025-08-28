import { ensureConnected } from '../realtime';

export async function createRoom(): Promise<string | null> {
  const res = await fetch('/api/rooms', { method: 'POST' });
  if (!res.ok) return null;
  const { code } = await res.json();
  return code;
}

export async function joinRoom(code: string, name: string, spectator = false) {
  const c = await ensureConnected();
  await c.invoke('JoinRoom', code.toUpperCase(), name, spectator);
}

export async function attachIssue(roomCode: string, issueKey: string) {
  const c = await ensureConnected();
  await c.invoke('AttachIssue', roomCode, issueKey);
}

export async function vote(roomCode: string, value: number | null) {
  const c = await ensureConnected();
  await c.invoke('Vote', roomCode, value);
}

export async function reveal(roomCode: string) {
  const c = await ensureConnected();
  await c.invoke('Reveal', roomCode);
}

export async function resetRound(roomCode: string) {
  const c = await ensureConnected();
  await c.invoke('ResetRound', roomCode);
}

export async function commitToJira(roomCode: string, issueKey: string, points: number) {
  const res = await fetch(`/api/rooms/${roomCode}/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ IssueKey: issueKey, FinalPoints: points }),
  });
  return res.ok;
}
