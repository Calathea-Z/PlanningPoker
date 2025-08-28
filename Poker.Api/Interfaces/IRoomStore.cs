using Poker.Api.Models;

namespace Poker.Api.Interfaces;

public interface IRoomStore {
    Task InitAsync(string code, TimeSpan ttl);
    Task<bool> JoinAsync(string code, string connId, string name, bool observer);
    Task RemoveConnectionAsync(string connId);
    Task UpdateAsync(string code, Action<RoomState> mutate);
    Task<RoomState?> GetAsync(string code);
}

