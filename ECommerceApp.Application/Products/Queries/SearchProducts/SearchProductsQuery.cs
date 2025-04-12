using AutoMapper;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Products.DTOs;
using ECommerceApp.Domain.Repositories;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Products.Queries.SearchProducts
{
    public class SearchProductsQuery : IRequest<Result<List<ProductDto>>>
    {
        public string SearchTerm { get; set; }
    }

    public class SearchProductsQueryValidator : AbstractValidator<SearchProductsQuery>
    {
        public SearchProductsQueryValidator()
        {
            RuleFor(v => v.SearchTerm).NotEmpty().MinimumLength(2);
        }
    }

    public class SearchProductsQueryHandler : IRequestHandler<SearchProductsQuery, Result<List<ProductDto>>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public SearchProductsQueryHandler(
            IProductRepository productRepository,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<Result<List<ProductDto>>> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
        {
            var products = await _productRepository.SearchProductsAsync(request.SearchTerm);
            return Result<List<ProductDto>>.Success(_mapper.Map<List<ProductDto>>(products));
        }
    }
}