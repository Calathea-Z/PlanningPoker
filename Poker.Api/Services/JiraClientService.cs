using Poker.Api.Interfaces;
using Poker.Api.Models;

namespace Poker.Api.Services;

public class JiraClientService : IJiraClientService
{
    public Task<bool> UpdateStoryPointsAsync(RoomState room, string issueKey, int points, CancellationToken ct = default)
    {
        Console.WriteLine($"[JIRA STUB] Would set {points} on {issueKey} for room {room.Code}");
        return Task.FromResult(true);
    }
}