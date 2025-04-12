using ECommerceApp.Domain.Common;

namespace ECommerceApp.Domain.Entities
{
    public class CartItem : BaseAuditableEntity
    {
        public int CartId { get; set; }
        public Cart Cart { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
    }
}
