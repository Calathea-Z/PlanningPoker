namespace Poker.Api.Models;


public static class StoryPointValues
{
    public static readonly string[] PlanningPokerValues = { "0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?", "∞" };

    public static bool IsValid(string v) => Array.IndexOf(PlanningPokerValues, v) >= 0;
}