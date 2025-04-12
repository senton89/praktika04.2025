using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Orders.Commands.CreateOrder;
using ECommerceApp.Application.Orders.Commands.UpdateOrderStatus;
using ECommerceApp.Application.Orders.DTOs;
using ECommerceApp.Application.Orders.Queries.GetOrderById;
using ECommerceApp.Application.Orders.Queries.GetUserOrders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.API.Controllers
{
    [Authorize]
    public class OrdersController : ApiControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<Result<OrderDto>>> GetById(int id)
        {
            var query = new GetOrderByIdQuery { OrderId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result);
            
            return NotFound(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<Result<List<OrderDto>>>> GetUserOrders(int userId)
        {
            // Check if the user is requesting their own orders
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId != userId.ToString())
                return Forbid();

            var query = new GetUserOrdersQuery { UserId = userId };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Result<OrderDto>>> Create(CreateOrderDto orderDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var command = new CreateOrderCommand { UserId = userId, OrderDto = orderDto };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
            
            return BadRequest(result);
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<Result<OrderDto>>> UpdateStatus(int id, UpdateOrderStatusDto statusDto)
        {
            var command = new UpdateOrderStatusCommand { OrderId = id, StatusDto = statusDto };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result);
            
            return BadRequest(result);
        }
    }
}