using Microsoft.AspNetCore.SignalR;
using Poker.Api.Interfaces;

namespace Poker.Api.Hubs;

public class PokerHub(IRoomService roomService) : Hub
{
    public override async Task OnDisconnectedAsync(Exception? ex)
    {
        await roomService.RemoveConnectionAsync(Context.ConnectionId);
        await base.OnDisconnectedAsync(ex);
    }

public async Task JoinRoom(string code, string name, bool observer = false)
{
    var ok = await roomService.JoinAsync(code, Context.ConnectionId, name, observer);
    if (!ok) throw new HubException("Room not found");

    await Groups.AddToGroupAsync(Context.ConnectionId, code);

    // Get the latest state (now includes the new player)
    var state = await roomService.GetAsync(code);

    // Send full state to the caller (new joiner)...
    await Clients.Caller.SendAsync("room_state", state);

    // ...and also send full state to everyone else in the room.
    await Clients.OthersInGroup(code).SendAsync("room_state", state);

    // (Optional) keep this if you want a lightweight “X joined” toast:
    await Clients.OthersInGroup(code).SendAsync("player_joined", new { name });
}

    public async Task AttachIssue(string code, string issueKey)
    {
        await roomService.AttachIssueAsync(code, issueKey);
        await Clients.Group(code).SendAsync("issue_attached", issueKey);
    }

    public async Task Vote(string code, int? value)
    {
        await roomService.VoteAsync(code, Context.ConnectionId, value);
        await Clients.Group(code).SendAsync("player_voted", Context.ConnectionId);
    }

    public async Task Reveal(string code)
    {
        var votes = await roomService.RevealAsync(code);
        await Clients.Group(code).SendAsync("revealed", votes);
    }

    public async Task ResetRound(string code)
    {
        await roomService.ResetRoundAsync(code);
        await Clients.Group(code).SendAsync("round_reset");
    }
}