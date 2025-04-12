using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Domain.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IReadOnlyList<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<IReadOnlyList<Product>> SearchProductsAsync(string searchTerm);
        Task<bool> UpdateStockAsync(int productId, int quantity);
    }
}
