namespace ECommerceApp.Application.Users.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public UserDto User { get; set; }
    }
}
