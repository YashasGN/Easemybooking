using Places_Services.Models;
using Places_Services.Models.DTO_Category;

namespace Places_Services.Repository.CategoryRepo
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category> GetCategoryByIdAsync(int id);
        Task<string> CreateCategoryAsync(NewCategory newCategory);
        Task<string> UpdateCategoryAsync(int id, UpdateCategory updateCategory);
        Task<bool> DeleteCategoryAsync(int id);


    }
}
