using Booking_Services.Models;
using Booking_Services.Models.DTO_Slots;
using Booking_Services.Repository.SlotsRepo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Booking_Services.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlotsController : ControllerBase
    {
        private readonly ISlotsRepository _slotRepository;


        public SlotsController(ISlotsRepository slotsRepository)
        {
            _slotRepository = slotsRepository;

        }

        [HttpPost("add")]
        public async Task<ActionResult> AddSlots(NewSlots newSlots)
        {
            try
            {
                if (newSlots == null || newSlots.PackageId <= 0)
                {
                    return BadRequest("Invalid Slots data.");
                }

                int? slotId = await _slotRepository.CreateSlotAsync(newSlots);

                if (slotId.HasValue)
                {
                    return Ok(new
                    {
                        message = "Slot added successfully.",
                        slotId = slotId.Value
                    });
                }
                else
                {
                    return StatusCode(500, "Failed to add slot.");
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
        public async Task<ActionResult> UpdateSlot(int id, UpdateSlots slots)
        {
            try
            {
                if (slots == null || id <= 0)
                {
                    return BadRequest("Invalid slot data.");
                }

                var result = await _slotRepository.UpdateSlotAsync(id, slots);


                if (result != null)
                {
                    return Ok("Slot updated successfully.");
                }
                else
                {
                    return StatusCode(500, "Failed to update slot.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("getSlotByPackageId/{id}")]
        public async Task<ActionResult<IEnumerable<Slots>>> GetSlotsByPackageId(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid package ID");
                }
                var slots = await _slotRepository.GetSlotsByPackageIdAsync(id);
                if (slots == null || !slots.Any())
                {
                    return NotFound($"No slots found for package ID {id}");
                }
                return Ok(slots);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error fetching slots: {ex.Message}");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSlot(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid slot ID");
                }

                var result = await _slotRepository.DeleteSlotAsync(id);
                if (result)
                {
                    return Ok("Slot deleted successfully");
                }
                else
                {
                    return NotFound($"Slot with ID {id} not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting slot: {ex.Message}");
            }
        }

        [HttpGet("getall")]
        
        public async Task<ActionResult<IEnumerable<Slots>>> GetAllSlots()
        {
            IEnumerable<Slots> slots = null;
           
                try
                {
                    slots = await _slotRepository.GetAllSlotsAsync();

                    return Ok(slots);
                }
                catch (Exception ex)
                {
                    // Log the exception (not implemented here)
                    return BadRequest($"Error fetching slots: {ex.Message}");
                }

            }
        [HttpDelete("deleteByPackageId/{packageId}")]
        public async Task<IActionResult> DeleteSlotByPackageId(int packageId)
        {
            try
            {
                if (packageId <= 0)
                {
                    return BadRequest("Invalid package ID");
                }
                var result = await _slotRepository.DeleteSlotByPackageId(packageId);
                if (result)
                {
                    return Ok("Slots deleted successfully for the specified package ID");
                }
                else
                {
                    return NotFound($"No slots found for package ID {packageId}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting slots: {ex.Message}");
            }
        }

        }
    }

