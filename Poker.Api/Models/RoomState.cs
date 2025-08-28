namespace Poker.Api.Models;

public class RoomState {
    public string Code { get; set; } = default!;
    public string? IssueKey { get; set; }
    public bool Revealed { get; set; }
    
     // connectionId -> Player
    public Dictionary<string, Player> Players { get; set; } = new();
    // connectionId -> vote (null represents “?” / no numeric vote)
    public Dictionary<string, string> Votes { get; set; } = new(); 
}

