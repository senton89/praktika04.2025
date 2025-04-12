using ECommerceApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;

namespace ECommerceApp.Infrastructure.Persistence
{
    public class ApplicationDbContextInitialiser
    {
        private readonly ILogger<ApplicationDbContextInitialiser> _logger;
        private readonly ApplicationDbContext _context;

        public ApplicationDbContextInitialiser(
            ILogger<ApplicationDbContextInitialiser> logger,
            ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task InitialiseAsync()
        {
            try
            {
                if (_context.Database.IsNpgsql())
                {
                    await _context.Database.MigrateAsync();
                }
                else
                {
                    await _context.Database.EnsureCreatedAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initialising the database.");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                await TrySeedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }

        private async Task TrySeedAsync()
        {
            // Seed Categories
            if (!_context.Categories.Any())
            {
                _context.Categories.AddRange(
                    new Category
                    {
                        Name = "Electronics",
                        Description = "Electronic devices and gadgets"
                    },
                    new Category
                    {
                        Name = "Clothing",
                        Description = "Apparel and fashion items"
                    },
                    new Category
                    {
                        Name = "Books",
                        Description = "Books and literature"
                    },
                    new Category
                    {
                        Name = "Home & Kitchen",
                        Description = "Home appliances and kitchen items"
                    }
                );

                await _context.SaveChangesAsync();
            }

            // Seed Products
            if (!_context.Products.Any())
            {
                var electronics = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Electronics");
                var clothing = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Clothing");
                var books = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Books");
                var homeKitchen = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Home & Kitchen");

                if (electronics != null)
                {
                    _context.Products.AddRange(
                        new Product
                        {
                            Name = "Smartphone X",
                            Description = "Latest smartphone with advanced features",
                            Price = 999.99m,
                            StockQuantity = 50,
                            ImageUrl = "smartphone.jpg",
                            CategoryId = electronics.Id
                        },
                        new Product
                        {
                            Name = "Laptop Pro",
                            Description = "High-performance laptop for professionals",
                            Price = 1499.99m,
                            StockQuantity = 30,
                            ImageUrl = "laptop.jpg",
                            CategoryId = electronics.Id
                        }
                    );
                }

                if (clothing != null)
                {
                    _context.Products.AddRange(
                        new Product
                        {
                            Name = "T-Shirt",
                            Description = "Comfortable cotton t-shirt",
                            Price = 19.99m,
                            StockQuantity = 100,
                            ImageUrl = "tshirt.jpg",
                            CategoryId = clothing.Id
                        },
                        new Product
                        {
                            Name = "Jeans",
                            Description = "Classic blue jeans",
                            Price = 49.99m,
                            StockQuantity = 80,
                            ImageUrl = "jeans.jpg",
                            CategoryId = clothing.Id
                        }
                    );
                }

                if (books != null)
                {
                    _context.Products.AddRange(
                        new Product
                        {
                            Name = "Programming Guide",
                            Description = "Comprehensive programming guide for beginners",
                            Price = 29.99m,
                            StockQuantity = 60,
                            ImageUrl = "programming-book.jpg",
                            CategoryId = books.Id
                        }
                    );
                }

                if (homeKitchen != null)
                {
                    _context.Products.AddRange(
                        new Product
                        {
                            Name = "Coffee Maker",
                            Description = "Automatic coffee maker with timer",
                            Price = 89.99m,
                            StockQuantity = 40,
                            ImageUrl = "coffee-maker.jpg",
                            CategoryId = homeKitchen.Id
                        }
                    );
                }

                await _context.SaveChangesAsync();
            }

            // Seed Users
            if (!_context.Users.Any())
            {
                // Create a simple password hash for demo purposes
                string CreatePasswordHash(string password)
                {
                    using var sha256 = SHA256.Create();
                    var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                    return Convert.ToBase64String(hashedBytes);
                }

                _context.Users.AddRange(
                    new User
                    {
                        Username = "admin",
                        Email = "admin@example.com",
                        PasswordHash = CreatePasswordHash("Admin123!"),
                        FirstName = "Admin",
                        LastName = "User",
                        Address = "123 Admin St, Admin City",
                        PhoneNumber = "123-456-7890"
                    },
                    new User
                    {
                        Username = "user",
                        Email = "user@example.com",
                        PasswordHash = CreatePasswordHash("User123!"),
                        FirstName = "Regular",
                        LastName = "User",
                        Address = "456 User Ave, User Town",
                        PhoneNumber = "098-765-4321"
                    }
                );

                await _context.SaveChangesAsync();
            }
        }
    }
}