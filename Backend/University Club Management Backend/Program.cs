using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Modules.Auth;
using University_Club_Management_Backend.Modules.ClubModule;
using University_Club_Management_Backend.Modules.DashboardModule;
using University_Club_Management_Backend.Modules.StudentVerificationModule;
using University_Club_Management_Backend.Modules.UserModule;
using University_Club_Management_Backend.Services;

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

// Add Application Services
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStudentVerificationService, StudentVerificationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IClubService, ClubService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Configure JWT Authentication
var secretKey = builder.Configuration["JWT_SECRET_KEY"]
                ?? Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
                ?? "YourSuperSecretKeyWithAtLeast32BytesLength!";
var issuer = builder.Configuration["JWT_ISSUER"]
             ?? Environment.GetEnvironmentVariable("JWT_ISSUER")
             ?? "UCMS_Backend";
var audience = builder.Configuration["JWT_AUDIENCE"]
              ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE")
              ?? "UCMS_Frontend";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add controllers with JsonStringEnumConverter and flexible media types
builder.Services.AddControllers(options =>
{
    var jsonInputFormatter = options.InputFormatters
        .OfType<Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonInputFormatter>()
        .FirstOrDefault();

    if (jsonInputFormatter != null)
    {
        jsonInputFormatter.SupportedMediaTypes.Add("text/plain");
        jsonInputFormatter.SupportedMediaTypes.Add("text/json");
        jsonInputFormatter.SupportedMediaTypes.Add("*/*");
    }
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

var app = builder.Build();

// Automatically apply database migrations & seed data on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    try
    {
        Console.WriteLine("Applying database migrations...");
        await db.Database.MigrateAsync();
        Console.WriteLine("Database connected and migrated successfully!");

        Console.WriteLine("Seeding database accounts...");
        await Seed.SeedDataAsync(db);
        Console.WriteLine("Database seeding completed!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database migration/seeding error: {ex.Message}");
    }
}

// Middleware
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Ok(new
{
    Message = "University Club Management System API is running!",
    Status = "Healthy",
    Timestamp = DateTime.UtcNow
}));

app.MapControllers();

app.Run();