using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace University_Club_Management_Backend.Services;

public interface ICloudinaryService
{
    Task<string?> UploadImageAsync(IFormFile? file, string folder);
}

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var cloudName = configuration["CLOUDINARY_CLOUD_NAME"]
                        ?? Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME");
        var apiKey = configuration["CLOUDINARY_API_KEY"]
                     ?? Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
        var apiSecret = configuration["CLOUDINARY_API_SECRET"]
                        ?? Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

        if (!string.IsNullOrWhiteSpace(cloudName) &&
            !string.IsNullOrWhiteSpace(apiKey) &&
            !string.IsNullOrWhiteSpace(apiSecret))
        {
            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true;
        }
        else
        {
            _cloudinary = null!;
        }
    }

    public async Task<string?> UploadImageAsync(IFormFile? file, string folder)
    {
        if (file == null || file.Length == 0)
        {
            return null;
        }

        if (_cloudinary == null)
        {
            throw new InvalidOperationException("Cloudinary credentials are not configured in environment variables or appsettings.");
        }

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            throw new Exception($"Cloudinary Upload Error: {uploadResult.Error.Message}");
        }

        return uploadResult.SecureUrl?.ToString() ?? uploadResult.Url?.ToString();
    }
}
