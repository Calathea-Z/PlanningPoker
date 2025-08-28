using Poker.Api.Interfaces;
using Poker.Api.Models;

namespace Poker.Api.Services;

public class RoomService : IRoomService
{
    private readonly IRoomStore _store;

    public RoomService(IRoomStore store)
    {
        _store = store;
    }

    public async Task<string> CreateRoomAsync(TimeSpan ttl)
    {
        var code = NewRoomCode();
        await _store.InitAsync(code, ttl);
        return code;
    }

    public Task<bool> JoinAsync(string code, string connectionId, string name, bool observer)
        => _store.JoinAsync(code, connectionId, name, observer);

    public Task AttachIssueAsync(string code, string issueKey)
        => _store.UpdateAsync(code, s => s.IssueKey = issueKey);

    public Task VoteAsync(string code, string connectionId, int? value)
        => _store.UpdateAsync(code, s => s.Votes[connectionId] = value?.ToString() ?? "?");

    public async Task<Dictionary<string, int?>> RevealAsync(string code)
    {
        await _store.UpdateAsync(code, s => s.Revealed = true);
        var state = await _store.GetAsync(code);
        var result = new Dictionary<string, int?>();
        if (state != null && state.Votes != null)
        {
            foreach (var kvp in state.Votes)
            {
                if (kvp.Value == "?" || string.IsNullOrWhiteSpace(kvp.Value))
                {
                    result[kvp.Key] = null;
                }
                else if (int.TryParse(kvp.Value, out var v))
                {
                    result[kvp.Key] = v;
                }
                else
                {
                    result[kvp.Key] = null;
                }
            }
        }
        return result;
    }

    public Task ResetRoundAsync(string code)
        => _store.UpdateAsync(code, s => { s.Revealed = false; s.Votes.Clear(); s.IssueKey = null; });

    public Task<RoomState?> GetAsync(string code) => _store.GetAsync(code);
    public Task RemoveConnectionAsync(string connectionId) => _store.RemoveConnectionAsync(connectionId);

    private static string NewRoomCode(int len = 6)
    {
        const string alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
        var r = Random.Shared;
        return new string(Enumerable.Range(0, len).Select(_ => alphabet[r.Next(alphabet.Length)]).ToArray());
    }
}