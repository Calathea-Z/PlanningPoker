

using Poker.Api.Hubs;
using Poker.Api.Infrastucture.Stores;
using Poker.Api.Interfaces;
using Poker.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

builder.Services.AddSignalR();
builder.Services.AddControllers();

// HTTP Client for JIRA API
builder.Services.AddHttpClient<IJiraService, JiraService>();

// Core services
builder.Services.AddSingleton<IRoomService, RoomService>();

// Interfaces -> Implementations (in-memory first)
builder.Services.AddSingleton<IRoomStore, InMemoryRoomStore>();
builder.Services.AddSingleton<IJiraClientService, JiraClientService>();

var app = builder.Build();

app.UseCors();
app.MapControllers();
app.MapHub<PokerHub>("/hubs/poker");

app.Run();