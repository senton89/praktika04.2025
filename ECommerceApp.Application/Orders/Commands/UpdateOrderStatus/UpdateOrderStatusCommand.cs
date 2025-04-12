using AutoMapper;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Orders.DTOs;
using ECommerceApp.Domain.Repositories;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Orders.Commands.UpdateOrderStatus
{
    public class UpdateOrderStatusCommand : IRequest<Result<OrderDto>>
    {
        public int OrderId { get; set; }
        public UpdateOrderStatusDto StatusDto { get; set; }
    }

    public class UpdateOrderStatusCommandValidator : AbstractValidator<UpdateOrderStatusCommand>
    {
        public UpdateOrderStatusCommandValidator()
        {
            RuleFor(v => v.OrderId).GreaterThan(0);
            RuleFor(v => v.StatusDto).SetValidator(new UpdateOrderStatusDtoValidator());
        }
    }

    public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, Result<OrderDto>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UpdateOrderStatusCommandHandler(
            IOrderRepository orderRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _orderRepository = orderRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<OrderDto>> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetOrderWithItemsAsync(request.OrderId);
            if (order == null)
            {
                return Result<OrderDto>.Failure(new[] { "Order not found" });
            }

            order.Status = request.StatusDto.Status;
            await _orderRepository.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<OrderDto>.Success(_mapper.Map<OrderDto>(order));
        }
    }
}