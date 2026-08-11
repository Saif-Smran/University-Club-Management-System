using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Get PostgreSQL connection string from environment variable
var connectionString =
    Environment.GetEnvironmentVariable("UCMS_DB_CONNECTION");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "UCMS_DB_CONNECTION environment variable is not set."
    );
}

// Add PostgreSQL database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

// Check database connection
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (await db.Database.CanConnectAsync())
    {
        Console.WriteLine("Database connected successfully!");
    }
}

// Middleware
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();