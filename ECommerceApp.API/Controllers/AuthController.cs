using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Users.Commands.LoginUser;
using ECommerceApp.Application.Users.Commands.RegisterUser;
using ECommerceApp.Application.Users.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{
    public class AuthController : ApiControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<Result<AuthResponseDto>>> Register(CreateUserDto userDto)
        {
            var command = new RegisterUserCommand { UserDto = userDto };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result);
            
            return BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<Result<AuthResponseDto>>> Login(LoginDto loginDto)
        {
            var command = new LoginUserCommand 
            { 
                Username = loginDto.Username, 
                Password = loginDto.Password 
            };
            
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result);
            
            return BadRequest(result);
        }
    }
}