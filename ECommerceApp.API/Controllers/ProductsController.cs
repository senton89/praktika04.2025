using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Products.Commands.CreateProduct;
using ECommerceApp.Application.Products.Commands.DeleteProduct;
using ECommerceApp.Application.Products.Commands.UpdateProduct;
using ECommerceApp.Application.Products.DTOs;
using ECommerceApp.Application.Products.Queries.GetAllProducts;
using ECommerceApp.Application.Products.Queries.GetProductById;
using ECommerceApp.Application.Products.Queries.GetProductsByCategory;
using ECommerceApp.Application.Products.Queries.SearchProducts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{
    public class ProductsController : ApiControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<Result<List<ProductDto>>>> GetAll()
        {
            var query = new GetAllProductsQuery();
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Result<ProductDto>>> GetById(int id)
        {
            var query = new GetProductByIdQuery { Id = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result);
            
            return NotFound(result);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<Result<List<ProductDto>>>> GetByCategory(int categoryId)
        {
            var query = new GetProductsByCategoryQuery { CategoryId = categoryId };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<Result<List<ProductDto>>>> Search([FromQuery] string term)
        {
            var query = new SearchProductsQuery { SearchTerm = term };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Result<ProductDto>>> Create(CreateProductDto productDto)
        {
            var command = new CreateProductCommand { ProductDto = productDto };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
            
            return BadRequest(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<Result<ProductDto>>> Update(int id, UpdateProductDto productDto)
        {
            var command = new UpdateProductCommand { Id = id, ProductDto = productDto };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result);
            
            return BadRequest(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Result>> Delete(int id)
        {
            var command = new DeleteProductCommand { Id = id };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result);
            
            return BadRequest(result);
        }
    }
}