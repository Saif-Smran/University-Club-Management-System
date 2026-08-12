using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("api/auth/register", async (RegisterDto dto, IAuthService authService) =>
        {
            var res = await authService.RegisterAsync(dto);
            return res.Success ? Results.Created($"/api/auth/users/{res.Data?.Id}", res) : Results.BadRequest(res);
        });

        app.MapPost("api/auth/login", async (LoginDto dto, IAuthService authService) =>
        {
            var res = await authService.LoginAsync(dto);
            return res.Success ? Results.Ok(res) : Results.Unauthorized();
        });
    }
}
