using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Places_Services.Models.DTO_Places;
using Places_Services.Repository;

namespace Places_Services.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlacesController : ControllerBase
    {
        private readonly IPlacesRepository _placesRepository;

        public PlacesController(IPlacesRepository placesRepository)
        {
            _placesRepository = placesRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPlace(NewPlaces newPlaces)
        {
            try
            {
                if (newPlaces == null)
                {
                    return BadRequest("Place data is null.");
                }

                if (string.IsNullOrEmpty(newPlaces.PlaceName) || string.IsNullOrEmpty(newPlaces.City) || newPlaces.CategoryId <= 0)
                {
                    return BadRequest("Place name, city, and category ID are required.");
                }

                var newPlaceId = await _placesRepository.CreatePlaceAsync(newPlaces);

                if (newPlaceId.HasValue)
                {
                    return Ok(new { message = "Place created successfully", placeId = newPlaceId.Value });
                }
                else
                {
                    return BadRequest("Error creating place.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating place: {ex.Message}");
            }
        }
        [HttpGet("getbycity/{city}")]
        public async Task<IActionResult> GetPlaceByCity(string city)
        {
            try
            {
                if (string.IsNullOrEmpty(city))
                {
                    return BadRequest("City name is required.");
                }
                else
                {
                    var place = await _placesRepository.GetPlaceByCityAsync(city);
                    if (place == null)
                    {
                        return NotFound($"No place found in {city}.");
                    }
                    else
                    {
                        return Ok(place);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving place: {ex.Message}");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePlace(int id, UpdatePlaces updatePlaces)
        {
            try
            {
                if (updatePlaces == null)
                {
                    return BadRequest("Place data is null.");
                }

                var result = await _placesRepository.UpdatePlaceAsync(id, updatePlaces);

                return result switch
                {
                    "Place updated successfully" => Ok(result),
                    "Place not found" => NotFound(result),
                    _ => BadRequest(result)
                };
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating place: {ex.Message}");
            }
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePlace(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid place ID.");
                }
                else
                {
                    var result = await _placesRepository.DeletePlaceAsync(id);
                    if (result)
                    {
                        return Ok("Place deleted successfully.");
                    }
                    else
                    {
                        return NotFound($"No place found with ID {id}.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting place: {ex.Message}");
            }
        }
        [HttpGet("getall")]
        public async Task<IActionResult> GetAllPlaces()
        {
            try
            {
                var places = await _placesRepository.GetAllPlacesAsync();
                if (places == null || !places.Any())
                {
                    return NotFound("No places found.");
                }
                else
                {
                    return Ok(places);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving places: {ex.Message}");
            }
        }
        [HttpGet("getbycategory/{categoryName}")]
        public async Task<IActionResult> GetPlaceByCategory(string categoryName)
        {
            try
            {
                if (string.IsNullOrEmpty(categoryName))
                {
                    return BadRequest("Category name is required.");
                }
                else
                {
                    var places = await _placesRepository.GetPlaceByCategoryAsync(categoryName);
                    if (places == null || !places.Any())
                    {
                        return NotFound($"No places found in category {categoryName}.");
                    }
                    else
                    {
                        return Ok(places);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving places by category: {ex.Message}");
            }
        }

        [HttpGet("getbycityandcategory/{city}/{categoryName}")]
        public async Task<IActionResult> GetPlaceByCityAndCategory(string city, string categoryName)
        {
            try
            {
                if (string.IsNullOrEmpty(city) || string.IsNullOrEmpty(categoryName))
                {
                    return BadRequest("City and category name are required.");
                }
                else
                {
                    var places = await _placesRepository.GetPlaceByCityAndCategoryAsync(city, categoryName);
                    if (places == null || !places.Any())
                    {
                        return NotFound($"No places found in {city} for category {categoryName}.");
                    }
                    else
                    {
                        return Ok(places);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving places by city and category: {ex.Message}");
            }
        }
        }
}
