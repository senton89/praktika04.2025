using AutoMapper;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Products.DTOs;
using ECommerceApp.Domain.Repositories;
using MediatR;

namespace ECommerceApp.Application.Products.Queries.GetAllProducts
{
    public class GetAllProductsQuery : IRequest<Result<List<ProductDto>>>
    {
    }

    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, Result<List<ProductDto>>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public GetAllProductsQueryHandler(
            IProductRepository productRepository,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<Result<List<ProductDto>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            var products = await _productRepository.GetAllAsync();
            return Result<List<ProductDto>>.Success(_mapper.Map<List<ProductDto>>(products));
        }
    }
}