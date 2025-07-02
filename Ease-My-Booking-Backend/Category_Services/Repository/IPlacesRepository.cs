using Places_Services.Models;
using Places_Services.Models.DTO_Places;

namespace Places_Services.Repository
{
    public interface IPlacesRepository
    {
        Task<IEnumerable<Place>> GetAllPlacesAsync();
        Task<Place?> GetPlaceByCityAsync(string city);
        Task<int?> CreatePlaceAsync(NewPlaces place);
        Task<string> UpdatePlaceAsync(int id, UpdatePlaces place);
        Task<bool> DeletePlaceAsync(int id);
        Task<List<Place>> GetPlaceByCategoryAsync(string categoryName);
        Task<List<Place>> GetPlaceByCityAndCategoryAsync(string city, string categoryName);
    }
}
