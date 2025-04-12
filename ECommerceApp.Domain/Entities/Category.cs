using ECommerceApp.Domain.Common;

namespace ECommerceApp.Domain.Entities
{
    public class Category : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
