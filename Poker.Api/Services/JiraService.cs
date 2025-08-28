using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Poker.Api.Models;

namespace Poker.Api.Services;

public interface IJiraService
{
    Task<JiraIssue?> GetIssueAsync(string issueKey);
    Task<bool> UpdateIssueStoryPointsAsync(string issueKey, int storyPoints);
}

public class JiraService : IJiraService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<JiraService> _logger;
    private readonly string _baseUrl;
    private readonly string _username;
    private readonly string _apiToken;

    public JiraService(HttpClient httpClient, IConfiguration configuration, ILogger<JiraService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        
        // Get JIRA configuration from appsettings
        _baseUrl = configuration["Jira:BaseUrl"] ?? "";
        _username = configuration["Jira:Username"] ?? "";
        _apiToken = configuration["Jira:ApiToken"] ?? "";
        
        // Set up basic auth header
        var authToken = Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"{_username}:{_apiToken}"));
        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);
        _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<JiraIssue?> GetIssueAsync(string issueKey)
    {
        try
        {
            var url = $"{_baseUrl}/rest/api/3/issue/{issueKey}";
            _logger.LogInformation("Attempting to fetch JIRA issue from: {Url}", url);
            
            var response = await _httpClient.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            
            _logger.LogInformation("JIRA API Response Status: {StatusCode}", response.StatusCode);
            _logger.LogInformation("JIRA API Response Content: {Content}", responseContent);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to get JIRA issue {IssueKey}: {StatusCode} - {Content}", issueKey, response.StatusCode, responseContent);
                return null;
            }

            var jiraResponse = JsonSerializer.Deserialize<JiraApiResponse>(responseContent);
            
            if (jiraResponse?.Fields == null)
            {
                _logger.LogWarning("Invalid JIRA response for issue {IssueKey} - Fields is null", issueKey);
                return null;
            }

            _logger.LogInformation("Successfully parsed JIRA issue {IssueKey}: {Summary}", issueKey, jiraResponse.Fields.Summary);

            return new JiraIssue
            {
                Key = issueKey,
                Summary = jiraResponse.Fields.Summary ?? "",
                Description = jiraResponse.Fields.Description?.Content?.FirstOrDefault()?.Content?.FirstOrDefault()?.Text ?? "",
                Status = jiraResponse.Fields.Status?.Name ?? "",
                Priority = jiraResponse.Fields.Priority?.Name ?? "",
                Assignee = jiraResponse.Fields.Assignee?.DisplayName ?? "",
                Reporter = jiraResponse.Fields.Reporter?.DisplayName ?? "",
                StoryPoints = jiraResponse.Fields.CustomField_10016 ?? 0, // Common story points field
                Labels = jiraResponse.Fields.Labels?.Where(l => !string.IsNullOrEmpty(l)).ToList() ?? new List<string>(),
                Components = jiraResponse.Fields.Components?.Select(c => c.Name).ToList() ?? new List<string>(),
                Created = jiraResponse.Fields.Created,
                Updated = jiraResponse.Fields.Updated
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting JIRA issue {IssueKey}", issueKey);
            return null;
        }
    }

    public async Task<bool> UpdateIssueStoryPointsAsync(string issueKey, int storyPoints)
    {
        try
        {
            var url = $"{_baseUrl}/rest/api/3/issue/{issueKey}";
            var payload = new
            {
                fields = new
                {
                    customfield_10016 = storyPoints // Common story points field ID
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PutAsync(url, content);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to update story points for issue {IssueKey}: {StatusCode}", issueKey, response.StatusCode);
                return false;
            }

            _logger.LogInformation("Successfully updated story points for issue {IssueKey} to {StoryPoints}", issueKey, storyPoints);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating story points for issue {IssueKey}", issueKey);
            return false;
        }
    }
}

// JIRA API Response Models
public class JiraApiResponse
{
    public JiraFields? Fields { get; set; }
}

public class JiraFields
{
    public string? Summary { get; set; }
    public JiraDescription? Description { get; set; }
    public JiraStatus? Status { get; set; }
    public JiraPriority? Priority { get; set; }
    public JiraUser? Assignee { get; set; }
    public JiraUser? Reporter { get; set; }
    public int? CustomField_10016 { get; set; } // Story points field
    public List<string>? Labels { get; set; }
    public List<JiraComponent>? Components { get; set; }
    public DateTime? Created { get; set; }
    public DateTime? Updated { get; set; }
}

public class JiraDescription
{
    public List<JiraContent>? Content { get; set; }
}

public class JiraContent
{
    public List<JiraText>? Content { get; set; }
}

public class JiraText
{
    public string? Text { get; set; }
}

public class JiraStatus
{
    public string? Name { get; set; }
}

public class JiraPriority
{
    public string? Name { get; set; }
}

public class JiraUser
{
    public string? DisplayName { get; set; }
}

public class JiraComponent
{
    public string? Name { get; set; }
}
