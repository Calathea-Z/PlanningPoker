using Poker.Api.Interfaces;
using Poker.Api.Models;

namespace Poker.Api.Infrastucture.Stores;

public class InMemoryRoomStore : IRoomStore
{
    private readonly Dictionary<string, RoomState> _rooms = new();
    private readonly Dictionary<string, string> _connToRoom = new();
    private readonly object _lock = new();

    public Task InitAsync(string code, TimeSpan ttl)
    {
        lock (_lock) _rooms[code] = new RoomState { Code = code };
        return Task.CompletedTask;
    }

    public Task<bool> JoinAsync(string code, string connectionId, string name, bool observer)
    {
        lock (_lock)
        {
            if (!_rooms.TryGetValue(code, out var state)) return Task.FromResult(false);
            state.Players[connectionId] = new Player { Name = name, Observer = observer };
            _connToRoom[connectionId] = code;
            return Task.FromResult(true);
        }
    }

    public Task RemoveConnectionAsync(string connectionId)
    {
        lock (_lock)
        {
            if (_connToRoom.TryGetValue(connectionId, out var code) && _rooms.TryGetValue(code, out var s))
            {
                s.Players.Remove(connectionId);
                s.Votes.Remove(connectionId);
            }
            _connToRoom.Remove(connectionId);
        }
        return Task.CompletedTask;
    }

    public Task UpdateAsync(string code, Action<RoomState> mutate)
    {
        lock (_lock)
        {
            if (!_rooms.TryGetValue(code, out var s))
            {
                s = new RoomState { Code = code };
                _rooms[code] = s;
            }
            mutate(s);
        }
        return Task.CompletedTask;
    }

    public Task<RoomState?> GetAsync(string code)
    {
        lock (_lock) return Task.FromResult(_rooms.TryGetValue(code, out var s) ? s : null);
    }
}
