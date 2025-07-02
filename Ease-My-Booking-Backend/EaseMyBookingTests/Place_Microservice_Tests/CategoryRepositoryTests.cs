using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Places_Services.Data;
using Places_Services.Models;
using Places_Services.Models.DTO_Category;
using Places_Services.Repository.CategoryRepo;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Place_Microservice_Tests
{
    [TestFixture]
    public class CategoryRepositoryTests
    {
        private PlacesDBContext _dbContext;
        private IMapper _mapper;
        private CategoryRepository _repository;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<PlacesDBContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new PlacesDBContext(options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<NewCategory, Category>();
                cfg.CreateMap<UpdateCategory, Category>();
            });
            _mapper = config.CreateMapper();

            _repository = new CategoryRepository(_dbContext, _mapper);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task GetAllCategoriesAsync_ReturnsAllCategories()
        {
            // Arrange
            _dbContext.Categories.Add(new Category { CategoryName = "Test1", Description = "Desc1", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            _dbContext.Categories.Add(new Category { CategoryName = "Test2", Description = "Desc2", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllCategoriesAsync();

            // Assert
            ClassicAssert.AreEqual(2, result.Count());
        }

        [Test]
        public async Task GetCategoryByIdAsync_ReturnsCategory_WhenExists()
        {
            // Arrange
            var category = new Category { CategoryName = "Test", Description = "Desc", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _repository.GetCategoryByIdAsync(category.Id);

            // Assert
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(category.CategoryName, result.CategoryName);
        }

        [Test]
        public async Task GetCategoryByIdAsync_ReturnsNull_WhenNotExists()
        {
            // Act
            var result = await _repository.GetCategoryByIdAsync(999);

            // Assert
            ClassicAssert.IsNull(result);
        }

        [Test]
        public async Task CreateCategoryAsync_CreatesCategory()
        {
            // Arrange
            var newCategory = new NewCategory
            {
                CategoryName = "NewCat",
                Description = "NewDesc",
                CreatedAt = DateTime.UtcNow
            };

            // Act
            var result = await _repository.CreateCategoryAsync(newCategory);

            // Assert
            ClassicAssert.AreEqual("Category created successfully", result);
            ClassicAssert.AreEqual(1, _dbContext.Categories.Count());
        }

        [Test]
        public async Task UpdateCategoryAsync_UpdatesCategory_WhenExists()
        {
            // Arrange
            var category = new Category { CategoryName = "Old", Description = "OldDesc", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            var update = new UpdateCategory
            {
                CategoryName = "Updated",
                Description = "UpdatedDesc",
                UpdatedAt = DateTime.UtcNow
            };

            // Act
            var result = await _repository.UpdateCategoryAsync(category.Id, update);

            // Assert
            ClassicAssert.AreEqual("Category updated successfully", result);
            var updated = await _dbContext.Categories.FindAsync(category.Id);
            ClassicAssert.AreEqual("Updated", updated.CategoryName);
        }

        [Test]
        public async Task UpdateCategoryAsync_ReturnsNotFound_WhenNotExists()
        {
            // Arrange
            var update = new UpdateCategory
            {
                CategoryName = "Updated",
                Description = "UpdatedDesc",
                UpdatedAt = DateTime.UtcNow
            };

            // Act
            var result = await _repository.UpdateCategoryAsync(999, update);

            // Assert
            ClassicAssert.AreEqual("Category not found", result);
        }

        [Test]
        public async Task DeleteCategoryAsync_DeletesCategory_WhenExists()
        {
            // Arrange
            var category = new Category { CategoryName = "ToDelete", Description = "Desc", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _repository.DeleteCategoryAsync(category.Id);

            // Assert
            ClassicAssert.IsTrue(result);
            ClassicAssert.AreEqual(0, _dbContext.Categories.Count());
        }

        [Test]
        public async Task DeleteCategoryAsync_ReturnsFalse_WhenNotExists()
        {
            // Act
            var result = await _repository.DeleteCategoryAsync(999);

            // Assert
            ClassicAssert.IsFalse(result);
        }
    }
}
