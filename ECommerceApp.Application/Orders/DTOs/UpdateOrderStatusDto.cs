using FluentValidation;

namespace ECommerceApp.Application.Orders.DTOs
{
    public class UpdateOrderStatusDto
    {
        public string Status { get; set; }
    }

    public class UpdateOrderStatusDtoValidator : AbstractValidator<UpdateOrderStatusDto>
    {
        public UpdateOrderStatusDtoValidator()
        {
            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required")
                .MaximumLength(20).WithMessage("Status must not exceed 20 characters");
        }
    }
}
