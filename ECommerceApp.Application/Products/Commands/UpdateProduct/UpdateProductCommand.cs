using AutoMapper;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Products.DTOs;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Domain.Repositories;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Products.Commands.UpdateProduct
{
    public class UpdateProductCommand : IRequest<Result<ProductDto>>
    {
        public int Id { get; set; }
        public UpdateProductDto ProductDto { get; set; }
    }

    public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
    {
        public UpdateProductCommandValidator()
        {
            RuleFor(v => v.Id).GreaterThan(0);
            RuleFor(v => v.ProductDto).SetValidator(new UpdateProductDtoValidator());
        }
    }

    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, Result<ProductDto>>
    {
        private readonly IRepository<Product> _productRepository;
        private readonly IRepository<Category> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UpdateProductCommandHandler(
            IRepository<Product> productRepository,
            IRepository<Category> categoryRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<ProductDto>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id);
            if (product == null)
            {
                return Result<ProductDto>.Failure(new[] { "Product not found" });
            }

            // Verify category exists
            var category = await _categoryRepository.GetByIdAsync(request.ProductDto.CategoryId);
            if (category == null)
            {
                return Result<ProductDto>.Failure(new[] { "Category not found" });
            }

            // Update product
            product.Name = request.ProductDto.Name;
            product.Description = request.ProductDto.Description;
            product.Price = request.ProductDto.Price;
            product.StockQuantity = request.ProductDto.StockQuantity;
            product.ImageUrl = request.ProductDto.ImageUrl;
            product.CategoryId = request.ProductDto.CategoryId;

            await _productRepository.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Get the updated product with category for mapping
            var updatedProduct = await _productRepository.GetByIdAsync(product.Id);
            return Result<ProductDto>.Success(_mapper.Map<ProductDto>(updatedProduct));
        }
    }
}