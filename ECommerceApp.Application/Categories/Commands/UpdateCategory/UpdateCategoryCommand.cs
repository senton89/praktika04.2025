using AutoMapper;
using ECommerceApp.Application.Categories.DTOs;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Domain.Repositories;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Categories.Commands.UpdateCategory
{
    public class UpdateCategoryCommand : IRequest<Result<CategoryDto>>
    {
        public int Id { get; set; }
        public UpdateCategoryDto CategoryDto { get; set; }
    }

    public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
    {
        public UpdateCategoryCommandValidator()
        {
            RuleFor(v => v.Id).GreaterThan(0);
            RuleFor(v => v.CategoryDto).SetValidator(new UpdateCategoryDtoValidator());
        }
    }

    public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result<CategoryDto>>
    {
        private readonly IRepository<Category> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UpdateCategoryCommandHandler(
            IRepository<Category> categoryRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<CategoryDto>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id);
            if (category == null)
            {
                return Result<CategoryDto>.Failure(new[] { "Category not found" });
            }

            category.Name = request.CategoryDto.Name;
            category.Description = request.CategoryDto.Description;

            await _categoryRepository.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<CategoryDto>.Success(_mapper.Map<CategoryDto>(category));
        }
    }
}