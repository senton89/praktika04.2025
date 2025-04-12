using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Users.Commands.UpdateUser;
using ECommerceApp.Application.Users.DTOs;
using ECommerceApp.Application.Users.Queries.GetUserById;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.API.Controllers
{
    [Authorize]
    public class UsersController : ApiControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<Result<UserDto>>> GetById(int id)
        {
            var query = new GetUserByIdQuery { UserId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result);
            
            return NotFound(result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Result<UserDto>>> Update(int id, UpdateUserDto userDto)
        {
            // Check if the user is updating their own profile
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != id.ToString())
                return Forbid();

            var command = new UpdateUserCommand { UserId = id, UserDto = userDto };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result);
            
            return BadRequest(result);
        }
    }
}