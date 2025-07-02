using Booking_Services.Models;
using Booking_Services.Models.DTO_Price;
using Booking_Services.Repository.PriceRepo;
using Microsoft.AspNetCore.Mvc;

namespace Booking_Services.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriceController : ControllerBase
    {
        private readonly IPriceRepository _priceRepository;

        public PriceController(IPriceRepository priceRepository)
        {
            _priceRepository = priceRepository;
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddPrice(NewPrice newPrice)
        {
            try
            {
                if (newPrice == null || newPrice.PackageId <= 0)
                {
                    return BadRequest("Invalid Price data.");
                }

                int? priceId = await _priceRepository.CreatePriceAsync(newPrice);

                if (priceId.HasValue)
                {
                    return Ok(new
                    {
                        message = "Price added successfully.",
                        priceId = priceId.Value
                    });
                }
                else
                {
                    return StatusCode(500, "Failed to add price.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Internal server error",
                    error = ex.Message
                });
            }
        }


        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdatePrice(int id, UpdatePrice price)
        {
            try
            {
                if (price == null || id <= 0)
                {
                    return BadRequest("Invalid price update data.");
                }

                var result = await _priceRepository.UpdatePriceAsync(id, price);
                if (result.Contains("not found"))
                    return NotFound(result);
                if (result.StartsWith("Error"))
                    return StatusCode(500, result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("getPriceByPackageId/{id}")]
        
        public async Task<ActionResult<Price>> GetPriceByPackageId(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid package ID");
                }
                var price = await _priceRepository.GetPriceByPackageIdAsync(id);
                if (price == null)
                {
                    return NotFound($"Price for package ID {id} not found");
                }
                return Ok(price);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching price: {ex.Message}");
            }
        }

        [HttpDelete("delete/{id}")]
        //public async Task<IActionResult> DeletePrice(int Priceid)
        //{
        //    try
        //    {
        //        if (Priceid <= 0)
        //        {
        //            return BadRequest("Invalid price ID");
        //        }

        //        var result = await _priceRepository.DeletePriceAsync(Priceid);
        //        if (result)
        //        {
        //            return Ok("Price deleted successfully");
        //        }
        //        else
        //        {
        //            return NotFound($"Price with ID {Priceid} not found");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting Price: {ex.Message}");
        //    }
        //}


        [HttpGet("getall")]
        public async Task<ActionResult<IEnumerable<Price>>> GetAllPrice()
        {
            IEnumerable<Price> price = null;

            try
            {
                price = await _priceRepository.GetAllPriceAsync();

                return Ok(price);
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return BadRequest($"Error fetching price: {ex.Message}");
            }
        }

        [HttpDelete("deleteByPackageId/{packageId}")]
        public async Task<IActionResult> DeletePriceByPackageId(int packageId)
        {
            try
            {
                if (packageId <= 0)
                {
                    return BadRequest("Invalid package ID");
                }
                var result = await _priceRepository.DeletePriceByPackageIdAsync(packageId);
                if (result)
                {
                    return Ok("Price deleted successfully");
                }
                else
                {
                    return NotFound($"Price for package ID {packageId} not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting Price: {ex.Message}");
            }
        }
        [HttpDelete("deleteBySlotId/{slotId}")]
        public async Task<IActionResult> DeletePriceBySlotId(int slotId)
        {
            try
            {
                if (slotId <= 0)
                {
                    return BadRequest("Invalid slot ID");
                }
                var result = await _priceRepository.DeletePriceBySlotIdAsync(slotId);
                if (result)
                {
                    return Ok("Price deleted successfully");
                }
                else
                {
                    return NotFound($"Price for slot ID {slotId} not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting Price: {ex.Message}");
            }
        }

        [HttpGet("getPriceBySlotId/{slotId}")]
        public async Task<ActionResult<List<Price>>> GetPriceBySlotId(int slotId)
        {
            try
            {
                if (slotId <= 0)
                {
                    return BadRequest("Invalid slot ID");
                }
                var prices = await _priceRepository.GetPriceBySlotIdAsync(slotId);
                if (prices == null || !prices.Any())
                {
                    return NotFound($"No prices found for slot ID {slotId}");
                }
                return Ok(prices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching prices: {ex.Message}");
            }
        }
        }
}