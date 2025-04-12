using FluentValidation;

namespace ECommerceApp.Application.Orders.DTOs
{
    public class CreateOrderDto
    {
        public string ShippingAddress { get; set; }
        public string PaymentMethod { get; set; }
        public List<CreateOrderItemDto> OrderItems { get; set; } = new List<CreateOrderItemDto>();
    }

    public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderDtoValidator()
        {
            RuleFor(x => x.ShippingAddress)
                .NotEmpty().WithMessage("Shipping address is required")
                .MaximumLength(200).WithMessage("Shipping address must not exceed 200 characters");

            RuleFor(x => x.PaymentMethod)
                .NotEmpty().WithMessage("Payment method is required")
                .MaximumLength(50).WithMessage("Payment method must not exceed 50 characters");

            RuleFor(x => x.OrderItems)
                .NotEmpty().WithMessage("Order must contain at least one item");

            RuleForEach(x => x.OrderItems).SetValidator(new CreateOrderItemDtoValidator());
        }
    }
}
