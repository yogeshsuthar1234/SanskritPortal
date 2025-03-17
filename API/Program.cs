using BCrypt.Net;
using Persistence.Context;
using Persistence.Repositories;
using Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddSingleton<MongoDbContext>(provider => 
{
    var config = provider.GetRequiredService<IConfiguration>();
    return new MongoDbContext(config);
});

// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// After app build

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();

app.UseCors("AllowAll");
app.Run();