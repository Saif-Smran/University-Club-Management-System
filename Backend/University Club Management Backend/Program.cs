using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;

// Load environment variables from .env file if available
DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// Get PostgreSQL connection string from environment variable or appsettings
var connectionString =
    Environment.GetEnvironmentVariable("UCMS_DB_CONNECTION")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration["UCMS_DB_CONNECTION"];

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "UCMS_DB_CONNECTION environment variable or ConnectionStrings:DefaultConnection is not set."
    );
}

// Add PostgreSQL database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

// Automatically apply database migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    try
    {
        Console.WriteLine("Applying database migrations...");
        await db.Database.MigrateAsync();
        Console.WriteLine("Database connected and migrated successfully!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database migration error: {ex.Message}");
    }
}

// Middleware
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapGet("/", () => Results.Ok(new
{
    Message = "University Club Management System API is running!",
    Status = "Healthy",
    Timestamp = DateTime.UtcNow
}));

app.MapControllers();

app.Run();