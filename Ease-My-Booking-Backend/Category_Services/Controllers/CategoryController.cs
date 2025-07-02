using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Places_Services.Models.DTO_Category;
using Places_Services.Repository.CategoryRepo;

namespace Places_Services.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddCategory(NewCategory newCategory)
        {
            try
            {
                if (newCategory == null)
                    return BadRequest("Category data is null");

                if (string.IsNullOrEmpty(newCategory.CategoryName) || string.IsNullOrEmpty(newCategory.Description))
                    return BadRequest("Category name and description is required");

                var result = await _categoryRepository.CreateCategoryAsync(newCategory);
                return result == "Category created successfully" ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating category: {ex.Message}");
            }
        }

        // ✅ FIXED: Responds to GET https://localhost:7215/api/category
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _categoryRepository.GetAllCategoriesAsync();
                if (categories == null || !categories.Any())
                    return NotFound("No categories found");

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving categories: {ex.Message}");
            }
        }

        // ✅ FIXED: Correct route format
        [HttpGet("getbyid/{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest("Invalid category ID");

                var category = await _categoryRepository.GetCategoryByIdAsync(id);
                return category == null ? NotFound($"Category with ID {id} not found") : Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching category: {ex.Message}");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategory updateCategory)
        {
            try
            {
                if (updateCategory == null)
                    return BadRequest("Update data is null");

                var result = await _categoryRepository.UpdateCategoryAsync(id, updateCategory);
                return result == "Category updated successfully" ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating category: {ex.Message}");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest("Invalid category ID");

                var result = await _categoryRepository.DeleteCategoryAsync(id);
                return result ? Ok("Category deleted successfully") : NotFound($"Category with ID {id} not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting category: {ex.Message}");
            }
        }
    }
}
