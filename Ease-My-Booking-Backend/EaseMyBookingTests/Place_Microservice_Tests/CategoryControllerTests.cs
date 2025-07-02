using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using NUnit.Framework.Legacy;
using Places_Services.Controllers;
using Places_Services.Models;
using Places_Services.Models.DTO_Category;
using Places_Services.Repository.CategoryRepo;

namespace EaseMyBooking_Tests.Place_Microservice_Tests
{
    [TestFixture]
    public class CategoryControllerTests
    {
        private Mock<ICategoryRepository> _mockRepo;
        private CategoryController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<ICategoryRepository>();
            _controller = new CategoryController(_mockRepo.Object);
        }

        [Test]
        public async Task AddCategory_NullCategory_ReturnsBadRequest()
        {
            var result = await _controller.AddCategory(null);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task AddCategory_MissingFields_ReturnsBadRequest()
        {
            var newCategory = new NewCategory { CategoryName = "", Description = "" };
            var result = await _controller.AddCategory(newCategory);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task AddCategory_Valid_ReturnsOk()
        {
            var newCategory = new NewCategory { CategoryName = "Test", Description = "Desc" };
            _mockRepo.Setup(r => r.CreateCategoryAsync(newCategory)).ReturnsAsync("Category created successfully");

            var result = await _controller.AddCategory(newCategory);
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetAllCategories_Empty_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetAllCategoriesAsync())
                .ReturnsAsync(new List<Category>());

            var result = await _controller.GetAllCategories();
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task GetAllCategories_ReturnsOk()
        {
            var categories = new List<Category>
            {
                new Category { Id = 1, CategoryName = "A", Description = "B" }
            };

            _mockRepo.Setup(r => r.GetAllCategoriesAsync())
                .ReturnsAsync(categories);

            var result = await _controller.GetAllCategories();
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetCategoryById_InvalidId_ReturnsBadRequest()
        {
            var result = await _controller.GetCategoryById(0);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task GetCategoryById_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetCategoryByIdAsync(1)).ReturnsAsync((Category)null);

            var result = await _controller.GetCategoryById(1);
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task GetCategoryById_Found_ReturnsOk()
        {
            var category = new Category { Id = 1, CategoryName = "A", Description = "B" };
            _mockRepo.Setup(r => r.GetCategoryByIdAsync(1)).ReturnsAsync(category);

            var result = await _controller.GetCategoryById(1);
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task UpdateCategory_NullUpdate_ReturnsBadRequest()
        {
            var result = await _controller.UpdateCategory(1, null);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task UpdateCategory_Success_ReturnsOk()
        {
            var update = new UpdateCategory { CategoryName = "A", Description = "B" };
            _mockRepo.Setup(r => r.UpdateCategoryAsync(1, update)).ReturnsAsync("Category updated successfully");

            var result = await _controller.UpdateCategory(1, update);
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task UpdateCategory_Failure_ReturnsBadRequest()
        {
            var update = new UpdateCategory { CategoryName = "A", Description = "B" };
            _mockRepo.Setup(r => r.UpdateCategoryAsync(1, update)).ReturnsAsync("Error");

            var result = await _controller.UpdateCategory(1, update);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task DeleteCategory_InvalidId_ReturnsBadRequest()
        {
            var result = await _controller.DeleteCategory(0);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task DeleteCategory_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.DeleteCategoryAsync(1)).ReturnsAsync(false);

            var result = await _controller.DeleteCategory(1);
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task DeleteCategory_Success_ReturnsOk()
        {
            _mockRepo.Setup(r => r.DeleteCategoryAsync(1)).ReturnsAsync(true);

            var result = await _controller.DeleteCategory(1);
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }
    }
}
