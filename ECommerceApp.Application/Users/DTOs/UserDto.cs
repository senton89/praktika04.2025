using AutoMapper;
using ECommerceApp.Application.Common.Mappings;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Users.DTOs
{
    public class UserDto : IMapFrom<User>
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<User, UserDto>();
        }
    }
}
