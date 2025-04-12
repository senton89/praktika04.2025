using AutoMapper;
using ECommerceApp.Application.Common.Mappings;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Orders.DTOs
{
    public class OrderItemDto : IMapFrom<OrderItem>
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice => Quantity * UnitPrice;

        public void Mapping(Profile profile)
        {
            profile.CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductName, opt => opt.MapFrom(s => s.Product.Name));
        }
    }
}
