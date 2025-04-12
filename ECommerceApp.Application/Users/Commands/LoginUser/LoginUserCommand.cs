using ECommerceApp.Application.Common.Interfaces;
using ECommerceApp.Application.Common.Models;
using ECommerceApp.Application.Users.DTOs;
using FluentValidation;
using MediatR;

namespace ECommerceApp.Application.Users.Commands.LoginUser
{
    public class LoginUserCommand : IRequest<Result<AuthResponseDto>>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginUserCommandValidator : AbstractValidator<LoginUserCommand>
    {
        public LoginUserCommandValidator()
        {
            RuleFor(v => v.Username).NotEmpty().WithMessage("Username is required");
            RuleFor(v => v.Password).NotEmpty().WithMessage("Password is required");
        }
    }

    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, Result<AuthResponseDto>>
    {
        private readonly IIdentityService _identityService;

        public LoginUserCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Result<AuthResponseDto>> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            return await _identityService.AuthenticateAsync(request.Username, request.Password);
        }
    }
}