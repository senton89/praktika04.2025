using ECommerceApp.Application.Categories.Commands.CreateCategory;
using ECommerceApp.Application.Categories.Commands.DeleteCategory;
using ECommerceApp.Application.Categories.Commands.UpdateCategory;
using ECommerceApp.Application.Categories.DTOs;
using ECommerceApp.Application.Categories.Queries.GetAllCategories;
using ECommerceApp.Application.Categories.Queries.GetCategoryById;
using ECommerceApp.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{
    public class CategoriesController : ApiControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<Result<List<CategoryDto>>>> GetAll()
        {
            var query = new GetAllCategoriesQuery();
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Result<CategoryDto>>> GetById(int id)
        {
            var query = new GetCategoryByIdQuery { Id = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result);
            
            return NotFound(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Result<CategoryDto>>> Create(CreateCategoryDto categoryDto)
        {
            var command = new CreateCategoryCommand { CategoryDto = categoryDto };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
            
            return BadRequest(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<Result<CategoryDto>>> Update(int id, UpdateCategoryDto categoryDto)
        {
            var command = new UpdateCategoryCommand { Id = id, CategoryDto = categoryDto };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result);
            
            return BadRequest(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Result>> Delete(int id)
        {
            var command = new DeleteCategoryCommand { Id = id };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result);
            
            return BadRequest(result);
        }
    }
}