using AutoMapper;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Orders.DTOs;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Domain.Repositories;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Orders.Commands.CreateOrder
{
    public class CreateOrderCommand : IRequest<Result<OrderDto>>
    {
        public int UserId { get; set; }
        public CreateOrderDto OrderDto { get; set; }
    }

    public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
    {
        public CreateOrderCommandValidator()
        {
            RuleFor(v => v.UserId).GreaterThan(0);
            RuleFor(v => v.OrderDto).SetValidator(new CreateOrderDtoValidator());
        }
    }

    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Result<OrderDto>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CreateOrderCommandHandler(
            IOrderRepository orderRepository,
            IProductRepository productRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<OrderDto>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            // Verify user exists
            var user = await _userRepository.GetByIdAsync(request.UserId);
            if (user == null)
            {
                return Result<OrderDto>.Failure(new[] { "User not found" });
            }

            // Create order
            var order = new Order
            {
                UserId = request.UserId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                ShippingAddress = request.OrderDto.ShippingAddress,
                PaymentMethod = request.OrderDto.PaymentMethod,
                TotalAmount = 0 // Will be calculated below
            };

            // Add order items and calculate total
            decimal totalAmount = 0;
            foreach (var item in request.OrderDto.OrderItems)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product == null)
                {
                    return Result<OrderDto>.Failure(new[] { $"Product with ID {item.ProductId} not found" });
                }

                if (product.StockQuantity < item.Quantity)
                {
                    return Result<OrderDto>.Failure(new[] { $"Not enough stock for product {product.Name}" });
                }

                var orderItem = new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };

                order.OrderItems.Add(orderItem);
                totalAmount += orderItem.UnitPrice * orderItem.Quantity;

                // Update product stock
                product.StockQuantity -= item.Quantity;
                await _productRepository.UpdateAsync(product);
            }

            order.TotalAmount = totalAmount;

            await _orderRepository.AddAsync(order);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Get the order with items for mapping
            var createdOrder = await _orderRepository.GetOrderWithItemsAsync(order.Id);
            return Result<OrderDto>.Success(_mapper.Map<OrderDto>(createdOrder));
        }
    }
}