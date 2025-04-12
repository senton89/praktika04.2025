using AutoMapper;
using ECommerceApp.Application.Common.Mappings;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Orders.DTOs
{
    public class OrderDto : IMapFrom<Order>
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; }
        public string PaymentMethod { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Order, OrderDto>()
                .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.User.Username))
                .ForMember(d => d.OrderItems, opt => opt.MapFrom(s => s.OrderItems));
        }
    }
}
