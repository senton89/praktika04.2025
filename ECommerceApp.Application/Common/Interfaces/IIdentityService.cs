using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Users.DTOs;

namespace ECommerceApp.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<Result<AuthResponseDto>> AuthenticateAsync(string username, string password);
        Task<Result<AuthResponseDto>> RegisterAsync(CreateUserDto userDto);
        Task<Result<UserDto>> GetUserByIdAsync(int userId);
        Task<Result<UserDto>> UpdateUserAsync(int userId, UpdateUserDto userDto);
        string GenerateJwtToken(int userId, string username, string email);
    }
}