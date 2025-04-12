using ECommerceApp.Application.Common.Models;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Domain.Repositories;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Categories.Commands.DeleteCategory
{
    public class DeleteCategoryCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class DeleteCategoryCommandValidator : AbstractValidator<DeleteCategoryCommand>
    {
        public DeleteCategoryCommandValidator()
        {
            RuleFor(v => v.Id).GreaterThan(0);
        }
    }

    public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result>
    {
        private readonly IRepository<Category> _categoryRepository;
        private readonly IRepository<Product> _productRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteCategoryCommandHandler(
            IRepository<Category> categoryRepository,
            IRepository<Product> productRepository,
            IUnitOfWork unitOfWork)
        {
            _categoryRepository = categoryRepository;
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id);
            if (category == null)
            {
                return Result.Failure(new[] { "Category not found" });
            }

            // Check if category has products
            var products = await _productRepository.GetAsync(p => p.CategoryId == request.Id);
            if (products.Any())
            {
                return Result.Failure(new[] { "Cannot delete category with associated products" });
            }

            await _categoryRepository.DeleteAsync(category);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}