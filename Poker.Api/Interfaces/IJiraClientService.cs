using Poker.Api.Models;

namespace Poker.Api.Interfaces;

public interface IJiraClientService
{
    Task<bool> UpdateStoryPointsAsync(RoomState room, string issueKey, int points, CancellationToken ct = default);
}