using Poker.Api.Models;

namespace Poker.Api.Interfaces;

public interface IRoomService
{
    Task<string> CreateRoomAsync(TimeSpan ttl);
    Task<bool> JoinAsync(string code, string connectionId, string name, bool observer);
    Task AttachIssueAsync(string code, string issueKey);
    Task VoteAsync(string code, string connectionId, int? value);
    Task<Dictionary<string,int?>> RevealAsync(string code);
    Task ResetRoundAsync(string code);
    Task<RoomState?> GetAsync(string code);
    Task RemoveConnectionAsync(string connectionId);
}