using AutoMapper;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Orders.DTOs;
using ECommerceApp.Domain.Repositories;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Orders.Queries.GetUserOrders
{
    public class GetUserOrdersQuery : IRequest<Result<List<OrderDto>>>
    {
        public int UserId { get; set; }
    }

    public class GetUserOrdersQueryValidator : AbstractValidator<GetUserOrdersQuery>
    {
        public GetUserOrdersQueryValidator()
        {
            RuleFor(v => v.UserId).GreaterThan(0);
        }
    }

    public class GetUserOrdersQueryHandler : IRequestHandler<GetUserOrdersQuery, Result<List<OrderDto>>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public GetUserOrdersQueryHandler(
            IOrderRepository orderRepository,
            IMapper mapper)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
        }

        public async Task<Result<List<OrderDto>>> Handle(GetUserOrdersQuery request, CancellationToken cancellationToken)
        {
            var orders = await _orderRepository.GetOrdersByUserIdAsync(request.UserId);
            return Result<List<OrderDto>>.Success(_mapper.Map<List<OrderDto>>(orders));
        }
    }
}