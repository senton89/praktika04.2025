using AutoMapper;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Products.DTOs;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Domain.Repositories;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Products.Commands.CreateProduct
{
    public class CreateProductCommand : IRequest<Result<ProductDto>>
    {
        public CreateProductDto ProductDto { get; set; }
    }

    public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductCommandValidator()
        {
            RuleFor(v => v.ProductDto).SetValidator(new CreateProductDtoValidator());
        }
    }

    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Result<ProductDto>>
    {
        private readonly IRepository<Product> _productRepository;
        private readonly IRepository<Category> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CreateProductCommandHandler(
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

        public async Task<Result<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            // Verify category exists
            var category = await _categoryRepository.GetByIdAsync(request.ProductDto.CategoryId);
            if (category == null)
            {
                return Result<ProductDto>.Failure(new[] { "Category not found" });
            }

            // Create product
            var product = new Product
            {
                Name = request.ProductDto.Name,
                Description = request.ProductDto.Description,
                Price = request.ProductDto.Price,
                StockQuantity = request.ProductDto.StockQuantity,
                ImageUrl = request.ProductDto.ImageUrl,
                CategoryId = request.ProductDto.CategoryId
            };

            await _productRepository.AddAsync(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Get the product with category for mapping
            var createdProduct = await _productRepository.GetByIdAsync(product.Id);
            return Result<ProductDto>.Success(_mapper.Map<ProductDto>(createdProduct));
        }
    }
}