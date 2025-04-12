using AutoMapper;
using ECommerceApp.Application.Categories.DTOs;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Domain.Repositories;
using MediatR;

namespace ECommerceApp.Application.Categories.Queries.GetAllCategories
{
    public class GetAllCategoriesQuery : IRequest<Result<List<CategoryDto>>>
    {
    }

    public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, Result<List<CategoryDto>>>
    {
        private readonly IRepository<Category> _categoryRepository;
        private readonly IMapper _mapper;

        public GetAllCategoriesQueryHandler(
            IRepository<Category> categoryRepository,
            IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<Result<List<CategoryDto>>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
        {
            var categories = await _categoryRepository.GetAllAsync();
            return Result<List<CategoryDto>>.Success(_mapper.Map<List<CategoryDto>>(categories));
        }
    }
}