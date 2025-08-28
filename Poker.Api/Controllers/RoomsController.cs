using Microsoft.AspNetCore.Mvc;
using Poker.Api.Interfaces;
using Poker.Api.Models;

namespace Poker.Api.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomsController(IRoomService rooms, IJiraClientService jira) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create()
    {
        var code = await rooms.CreateRoomAsync(TimeSpan.FromMinutes(60));
        return Ok(new { code });
    }

    [HttpPost("{code}/commit")]
    public async Task<IActionResult> Commit(string code, [FromBody] CommitBody body)
    {
        var state = await rooms.GetAsync(code);
        if (state is null || string.IsNullOrWhiteSpace(body.IssueKey) || body.FinalPoints is null)
            return BadRequest(new { error = "Invalid request" });

        var ok = await jira.UpdateStoryPointsAsync(state, body.IssueKey, body.FinalPoints.Value);
        return ok ? Ok() : BadRequest(new { error = "Jira update failed" });
    }
}