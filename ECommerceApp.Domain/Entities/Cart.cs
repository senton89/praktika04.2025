using ECommerceApp.Domain.Common;

namespace ECommerceApp.Domain.Entities
{
    public class Cart : BaseAuditableEntity
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
