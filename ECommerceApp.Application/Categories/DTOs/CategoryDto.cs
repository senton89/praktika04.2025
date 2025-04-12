using AutoMapper;
using ECommerceApp.Application.Common.Mappings;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Categories.DTOs
{
    public class CategoryDto : IMapFrom<Category>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Category, CategoryDto>();
        }
    }
}
