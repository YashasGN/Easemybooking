using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Package_MicroService.Models.DTO;
using Package_MicroService.Repository;

namespace Package_MicroService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackageController : ControllerBase
    {
        private readonly IPackageRepository _packageRepository;

        public PackageController(IPackageRepository packageRepository)
        {
            _packageRepository = packageRepository;
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddPackage(NewPackage newPackage)
        {
            try
            {
                if (newPackage == null)
                {
                    return BadRequest("Invalid package data.");
                }

                int? packageId = await _packageRepository.CreatePackageAsync(newPackage);

                if (packageId.HasValue)
                {
                    return Ok(new
                    {
                        message = "Package created successfully",
                        packageId = packageId.Value
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        message = "Failed to create package"
                    });
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


        //update package controller:
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePackage(int id, UpdatePackage updatePackage)
        {
            try
            {
                if (updatePackage == null || id <= 0)
                {
                    return BadRequest("Invalid Id or Request");
                }
                else
                {
                    var (status, message) = await _packageRepository.UpdatePackageAsync(id, updatePackage);
                    if (status == 1)
                    {
                        return Ok(message);
                    }
                    else
                    {
                        return BadRequest(message);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return BadRequest($"Error updating package: {ex.Message}");
            }
        }

        [HttpGet("getbyId/{id}")]
        public async Task<IActionResult> GetPackageById(int id)
        {
            try
            {
                var (status, package) = await _packageRepository.GetPackageByIdAsync(id);
                if (status == 0)
                {
                    return NotFound("Package not found");
                }
                else if (status == -1)
                {
                    return BadRequest("something wrong");
                }
                else
                {
                    return Ok(package);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error fetching package");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePackageById(int id)
        {
            try
            {
                var (status, package) = await _packageRepository.DeletePackageAsync(id);
                if (status == false)
                {
                    return NotFound("Package not found");
                }
                else if (status == false)
                {
                    return BadRequest("something wrong");
                }
                else
                {
                    return Ok(package);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error fetching package");
            }
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAllPackage()
        {
            try
            {
                var packages = await _packageRepository.GetAllPackagesAsync();

                if (packages == null || !packages.Any())
                {
                    return NotFound("No packages found.");
                }

                return Ok(packages);
            }
            catch (Exception ex)
            {
                // Optional: log exception here
                return StatusCode(500, "Internal server error while fetching packages.");
            }
        }

        [HttpGet("getbyplaceid/{placeId}")]
        public async Task<IActionResult> GetPackageByPlaceId(int placeId)
        {
            try
            {
                if (placeId <= 0)
                {
                    return BadRequest("Invalid Place ID.");
                }
                var packages = await _packageRepository.GetPackageByPlaceIdAsync(placeId);
                if (packages == null || !packages.Any())
                {
                    return NotFound("No packages found for the specified place ID.");
                }
                return Ok(packages);
            }
            catch (Exception ex)
            {
                // Optional: log exception here
                return StatusCode(500, $"Internal server error while fetching packages by place ID: {ex.Message}");
            }
        }

    }
}