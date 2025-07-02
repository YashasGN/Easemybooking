using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Places_Services.Data;
using Places_Services.Models;
using Places_Services.Models.DTO_Category;

namespace Places_Services.Repository.CategoryRepo
{
    public class CategoryRepository :ICategoryRepository
    {
        private readonly PlacesDBContext _placesDbContext;
        private readonly IMapper _mapper;
        public CategoryRepository(PlacesDBContext placesDbContext, IMapper mapper)
        {
            _placesDbContext = placesDbContext;
            _mapper = mapper;
        }
        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            try
            {
                return await _placesDbContext.Categories.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving categories: {ex.Message}");
            }
        }
        public async Task<Category> GetCategoryByIdAsync(int id)
        {
            try
            {
                var category = await _placesDbContext.Categories.FirstOrDefaultAsync(e => e.Id == id);
                if (category == null)
                {
                    return null; // Category not found
                }
                else
                {
                    return category; // Category found
                }

            }
            catch (Exception ex)
            {
                return null; // Error occurred while retrieving category

            }
        }
        public async Task<string> CreateCategoryAsync(NewCategory newCategory)
        {
            try
            {
                Category category = new Category();
                _mapper.Map(newCategory, category);
                await _placesDbContext.Categories.AddAsync(category);
                await _placesDbContext.SaveChangesAsync();
                return "Category created successfully";
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "No inner exception";
                return $"Error creating category: {ex.Message} | Inner: {inner}";
            }
        }
        public async Task<string> UpdateCategoryAsync(int id, UpdateCategory updateCategory)
        {
            try
            {
                var category = await _placesDbContext.Categories.FindAsync(id);
                if (category == null)
                {
                    return "Category not found"; // Category not found
                }
                _mapper.Map(updateCategory, category);
                _placesDbContext.Categories.Update(category);
                await _placesDbContext.SaveChangesAsync();
                return "Category updated successfully";
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "No inner exception";
                return $"Error updating category: {ex.Message} | Inner: {inner}";
            }
        }
        public async Task<bool> DeleteCategoryAsync(int id)
        {
            try
            {
                var category = await _placesDbContext.Categories.FindAsync(id);
                if (category == null)
                {
                    return false; // Category not found
                }
                _placesDbContext.Categories.Remove(category);
                await _placesDbContext.SaveChangesAsync();
                return true; // Category deleted successfully
            }
            catch (Exception)
            {
                return false; // Error occurred while deleting
            }
        }


        }
}
