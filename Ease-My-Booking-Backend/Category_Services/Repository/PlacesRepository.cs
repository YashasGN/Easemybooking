using Places_Services.Data;
using Places_Services.Models;
using Places_Services.Models.DTO_Places;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Places_Services.Repository
{
    public class PlacesRepository : IPlacesRepository
    {
        private readonly PlacesDBContext _placesDbContext;
        private readonly IMapper _mapper;
        public PlacesRepository(PlacesDBContext placesDbContext, IMapper mapper)
        {
            _placesDbContext = placesDbContext;
            _mapper = mapper;
        }

        public async Task<int?> CreatePlaceAsync(NewPlaces place)
        {
            try
            {
                Place newPlace = new Place();
                _mapper.Map(place, newPlace);
                newPlace.IsActive = false;
                newPlace.IsVerified = false;
                newPlace.IsRejected = false;

                await _placesDbContext.Places.AddAsync(newPlace);
                await _placesDbContext.SaveChangesAsync();
                return newPlace.Id;
            }
            catch (Exception ex)
            {
                
                return null;
            }
        }

        public async Task<bool> DeletePlaceAsync(int id)
        {
            try
            {
                var place = await _placesDbContext.Places.FindAsync(id);
                if (place == null)
                {
                    return false; // Place not found
                }
                _placesDbContext.Places.Remove(place);
                await _placesDbContext.SaveChangesAsync();
                return true; // Place deleted successfully
            }
            catch (Exception)
            {
                return false; // Error occurred while deleting
            }
        }

        public async Task<IEnumerable<Place>> GetAllPlacesAsync()
        {
            try
            {
                return await _placesDbContext.Places
                    .Include(p => p.Category) // Eager load Category
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving places: {ex.Message}");
            }
        }

        public async Task<Place?> GetPlaceByCityAsync(string city)
        {
            try
            {
                var place = await _placesDbContext.Places
                    .FirstOrDefaultAsync(p => p.City.ToLower() == city.ToLower());
                if (place == null)
                {
                    return null; // Place not found
                }
                else
                {
                    return place; // Place found
                }
            }
            catch (Exception ex)
            {
                return null; // Error occurred while retrieving place
            }
        }

        public async Task<string> UpdatePlaceAsync(int id, UpdatePlaces place)
        {
            var existingPlace = await _placesDbContext.Places.FindAsync(id);
            if (existingPlace == null)
                return "Place not found";

            // Validate and update only meaningful values
            if (!string.IsNullOrWhiteSpace(place.PlaceName) && place.PlaceName.ToLower() != "string")
                existingPlace.PlaceName = place.PlaceName;

            if (place.CategoryId.HasValue && place.CategoryId.Value > 0)
                existingPlace.CategoryId = place.CategoryId.Value;

            if (!string.IsNullOrWhiteSpace(place.City) && place.City.ToLower() != "string")
                existingPlace.City = place.City;

            if (!string.IsNullOrWhiteSpace(place.State) && place.State.ToLower() != "string")
                existingPlace.State = place.State;

            if (!string.IsNullOrWhiteSpace(place.Country) && place.Country.ToLower() != "string")
                existingPlace.Country = place.Country;

            if (!string.IsNullOrWhiteSpace(place.Address) && place.Address.ToLower() != "string")
                existingPlace.Address = place.Address;

            if (place.PinCode.HasValue && place.PinCode.Value > 0)
                existingPlace.PinCode = place.PinCode.Value;

            if (!string.IsNullOrWhiteSpace(place.Description) && place.Description.ToLower() != "string")
                existingPlace.Description = place.Description;

            if (!string.IsNullOrWhiteSpace(place.ImageUrl) && place.ImageUrl.ToLower() != "string")
                existingPlace.ImageUrl = place.ImageUrl;

            if (place.IsVerified.HasValue)
                existingPlace.IsVerified = place.IsVerified.Value;

            if (!string.IsNullOrWhiteSpace(place.VerifiedBy) && place.VerifiedBy.ToLower() != "string")
                existingPlace.VerifiedBy = place.VerifiedBy;

            if(place.IsRejected.HasValue)
                existingPlace.IsRejected = place.IsRejected.Value; // If IsRejected is true, set it to true
            if (place.IsActive.HasValue)
                existingPlace.IsActive = place.IsActive.Value; // If IsActive is true, set it to true
                   // Always update the timestamp
            existingPlace.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _placesDbContext.SaveChangesAsync();
                return "Place updated successfully";
            }
            catch (DbUpdateConcurrencyException)
            {
                return "Error: Place was modified by another user. Please try again.";
            }
        }


        public async Task<List<Place>> GetPlaceByCategoryAsync(string categoryName)
        {
            try
            {
                var places = await _placesDbContext.Places
                    .Where(p => p.Category.CategoryName.ToLower() == categoryName.ToLower())
                    .ToListAsync();
                if (places == null)
                {
                    return new List<Place>(); // No places found for the category
                }
                else
                {
                    return places; // Places found for the category
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving places by category: {ex.Message}");
            }


        }
        public async Task<List<Place>> GetPlaceByCityAndCategoryAsync(string city, string categoryName)
        {
            try
            {
                var places = await _placesDbContext.Places
                    .Where(p => p.City.ToLower() == city.ToLower() &&
                                p.Category.CategoryName.ToLower() == categoryName.ToLower())
                    .ToListAsync();

                if (places == null)
                {
                    return new List<Place>(); // No places found for the city and category
                }
                else
                {
                    return places; // Places found for the city and category
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving places by city and category: {ex.Message}");
            }
        }
        }

    }
