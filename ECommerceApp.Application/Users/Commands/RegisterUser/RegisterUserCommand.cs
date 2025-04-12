using ECommerceApp.Application.Common.Interfaces;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Users.DTOs;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Users.Commands.RegisterUser
{
    public class RegisterUserCommand : IRequest<Result<AuthResponseDto>>
    {
        public CreateUserDto UserDto { get; set; }
    }

    public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
    {
        public RegisterUserCommandValidator()
        {
            RuleFor(v => v.UserDto).SetValidator(new CreateUserDtoValidator());
        }
    }

    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Result<AuthResponseDto>>
    {
        private readonly IIdentityService _identityService;

        public RegisterUserCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Result<AuthResponseDto>> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            return await _identityService.RegisterAsync(request.UserDto);
        }
    }
}