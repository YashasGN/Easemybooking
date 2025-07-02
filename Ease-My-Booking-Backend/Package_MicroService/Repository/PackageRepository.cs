using Package_MicroService.Data;
using AutoMapper;
using Package_MicroService.Models;
using Package_MicroService.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace Package_MicroService.Repository
{
    public class PackageRepository : IPackageRepository
    {
        private readonly PackageDbContext _packageDbContext;
        private readonly IMapper _mapper;
        public PackageRepository(PackageDbContext packageDbContext, IMapper mapper)
        {
            _packageDbContext = packageDbContext;
            _mapper = mapper;
        }
        public async Task<int?> CreatePackageAsync(NewPackage package)
        {
            try
            {
                var newPackage = _mapper.Map<Package>(package);
                await _packageDbContext.Package.AddAsync(newPackage);
                await _packageDbContext.SaveChangesAsync();
                return newPackage.Id;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<(bool, string)> DeletePackageAsync(int id)
        {
            try
            {
                var package = await _packageDbContext.Package.FirstOrDefaultAsync(e => e.Id == id);
                if (package == null)
                {
                    return (false, "package not found");
                }
                else
                {
                    _packageDbContext.Package.Remove(package);
                    await _packageDbContext.SaveChangesAsync();
                    return (true, "Package deleted successfully");
                }
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        public async Task<IEnumerable<Package>> GetAllPackagesAsync()
        {

            try
            {
                var packages = await _packageDbContext.Package.ToListAsync();
                return packages;
            }
            catch (Exception ex)
            {
                // Log exception if needed
                return new List<Package>(); // return empty list on failure
            }
        }

        public async Task<(int, Package)> GetPackageByIdAsync(int id)
        {
            try
            {
                var package = await _packageDbContext.Package.FirstOrDefaultAsync(e => e.Id == id);
                if (package == null)
                {
                    return (0, null);
                }
                else
                {
                    return (1, package);
                }
            }
            catch (Exception ex)
            {
                return (-1, null);
            }
        }

        public async Task<(int, string)> UpdatePackageAsync(int id, UpdatePackage package)
        {
            var existingPackage = await _packageDbContext.Package.FindAsync(id);
            if (existingPackage == null)
            {
                return (0, "Package Not Found!");
            }

            // Safely update only fields that have meaningful values
            if (!string.IsNullOrWhiteSpace(package.PackageName) && package.PackageName.ToLower() != "string")
                existingPackage.PackageName = package.PackageName;

            if (!string.IsNullOrWhiteSpace(package.Details) && package.Details.ToLower() != "string")
                existingPackage.Details = package.Details;

            if (!string.IsNullOrWhiteSpace(package.ImageUrl) && package.ImageUrl.ToLower() != "string")
                existingPackage.ImageUrl = package.ImageUrl;

            if (package.Rating.HasValue && package.Rating.Value >= 0)
                existingPackage.Rating = package.Rating.Value;

            // Always update the timestamp
            existingPackage.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _packageDbContext.SaveChangesAsync();
                return (1, "Package Updated Successfully");
            }
            catch (Exception ex)
            {
                return (0, $"Error Updating Package: {ex.Message}");
            }
        }


        public async Task<List<Package>> GetPackageByPlaceIdAsync(int placeId)
        {
            try
            {
                var packages = await _packageDbContext.Package
                    .Where(p => p.PlaceId == placeId)
                    .ToListAsync();
                return packages;
            }
            catch (Exception ex)
            {
                // Log exception if needed
                return new List<Package>(); // return empty list on failure
            }
        }
        }
}



