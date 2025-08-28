namespace Poker.Api.Models;

public class JiraIssue
{
    public string Key { get; set; } = "";
    public string Summary { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "";
    public string Priority { get; set; } = "";
    public string Assignee { get; set; } = "";
    public string Reporter { get; set; } = "";
    public int StoryPoints { get; set; }
    public List<string> Labels { get; set; } = new();
    public List<string> Components { get; set; } = new();
    public DateTime? Created { get; set; }
    public DateTime? Updated { get; set; }
}
