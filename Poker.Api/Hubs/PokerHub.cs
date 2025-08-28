using Microsoft.AspNetCore.SignalR;
using Poker.Api.Interfaces;
using Microsoft.Extensions.Logging;

namespace Poker.Api.Hubs;

public class PokerHub(IRoomService roomService, ILogger<PokerHub> logger, IHubContext<PokerHub> hubContext) : Hub
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

        // (Optional) keep this if you want a lightweight "X joined" toast:
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
        logger.LogInformation("Reveal started for room {Code}", code);
        
        var votes = await roomService.RevealAsync(code);
        
        // Send countdown started event
        logger.LogInformation("Sending countdown_started event for room {Code}", code);
        await Clients.Group(code).SendAsync("countdown_started", 3);
        
        // Start countdown timer using the injected hub context
        _ = Task.Run(async () =>
        {
            try
            {
                logger.LogInformation("Starting countdown for room {Code}", code);
                
                // Wait 1 second before starting the countdown loop
                await Task.Delay(1000);
                
                for (int i = 2; i > 0; i--)
                {
                    logger.LogInformation("Countdown: {Countdown} for room {Code}", i, code);
                    await roomService.UpdateCountdownAsync(code, i);
                    await hubContext.Clients.Group(code).SendAsync("countdown_updated", i);
                    await Task.Delay(1000); // Wait 1 second after sending the update
                }
                
                // Add a shorter delay after showing "1" so users can see it but not too long
                logger.LogInformation("Countdown finished, waiting before reveal for room {Code}", code);
                await Task.Delay(500); // Wait 0.5 seconds so users can see "1"
                
                // Countdown finished, reveal the votes
                logger.LogInformation("Revealing votes for room {Code}", code);
                await roomService.CompleteRevealAsync(code);
                await hubContext.Clients.Group(code).SendAsync("revealed", votes);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during countdown for room {Code}", code);
            }
        });
    }

    public async Task ResetRound(string code)
    {
        await roomService.ResetRoundAsync(code);
        await Clients.Group(code).SendAsync("round_reset");
    }
}