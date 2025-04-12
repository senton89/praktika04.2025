using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using ECommerceApp.Application.Common.Interfaces;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Users.DTOs;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Domain.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ECommerceApp.Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public IdentityService(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<Result<AuthResponseDto>> AuthenticateAsync(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null)
            {
                return Result<AuthResponseDto>.Failure(new[] { "Invalid username or password" });
            }

            if (!VerifyPasswordHash(password, user.PasswordHash))
            {
                return Result<AuthResponseDto>.Failure(new[] { "Invalid username or password" });
            }

            var token = GenerateJwtToken(user.Id, user.Username, user.Email);
            var userDto = _mapper.Map<UserDto>(user);

            return Result<AuthResponseDto>.Success(new AuthResponseDto
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddDays(7),
                User = userDto
            });
        }

        public async Task<Result<AuthResponseDto>> RegisterAsync(CreateUserDto userDto)
        {
            // Check if username is unique
            if (!await _userRepository.IsUsernameUniqueAsync(userDto.Username))
            {
                return Result<AuthResponseDto>.Failure(new[] { "Username is already taken" });
            }

            // Check if email is unique
            if (!await _userRepository.IsEmailUniqueAsync(userDto.Email))
            {
                return Result<AuthResponseDto>.Failure(new[] { "Email is already registered" });
            }

            // Create new user
            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = CreatePasswordHash(userDto.Password),
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Address = userDto.Address,
                PhoneNumber = userDto.PhoneNumber
            };

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Generate token
            var token = GenerateJwtToken(user.Id, user.Username, user.Email);
            var createdUserDto = _mapper.Map<UserDto>(user);

            return Result<AuthResponseDto>.Success(new AuthResponseDto
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddDays(7),
                User = createdUserDto
            });
        }

        public async Task<Result<UserDto>> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return Result<UserDto>.Failure(new[] { "User not found" });
            }

            return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
        }

        public async Task<Result<UserDto>> UpdateUserAsync(int userId, UpdateUserDto userDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return Result<UserDto>.Failure(new[] { "User not found" });
            }

            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Address = userDto.Address;
            user.PhoneNumber = userDto.PhoneNumber;

            await _userRepository.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
        }

        public string GenerateJwtToken(int userId, string username, string email)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Email, email)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string CreatePasswordHash(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPasswordHash(string password, string storedHash)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var hash = Convert.ToBase64String(hashedBytes);
            return hash == storedHash;
        }
    }
}