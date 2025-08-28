using Microsoft.AspNetCore.Mvc;
using Poker.Api.Interfaces;
using Poker.Api.Models;

namespace Poker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JiraController : ControllerBase
{
    private readonly IRoomService _roomService;

    public JiraController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet("issue/{issueKey}")]
    public async Task<IActionResult> GetIssue(string issueKey)
    {
        var issue = await _roomService.GetJiraIssueAsync(issueKey);
        if (issue == null)
        {
            return NotFound($"Issue {issueKey} not found");
        }
        return Ok(issue);
    }

    [HttpPost("commit")]
    public async Task<IActionResult> CommitStoryPoints([FromBody] CommitRequest request)
    {
        if (string.IsNullOrEmpty(request.IssueKey))
        {
            return BadRequest("Issue key is required");
        }

        var success = await _roomService.CommitToJiraAsync(request.RoomCode, request.IssueKey, request.StoryPoints);
        if (!success)
        {
            return BadRequest("Failed to commit story points to JIRA");
        }

        return Ok(new { success = true });
    }
}

public class CommitRequest
{
    public string RoomCode { get; set; } = "";
    public string IssueKey { get; set; } = "";
    public int StoryPoints { get; set; }
}
