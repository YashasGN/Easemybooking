using Package_MicroService.Models.DTO;
using Package_MicroService.Models;

namespace Package_MicroService.Repository
{
    public interface IPackageRepository
    {
        Task<IEnumerable<Package>> GetAllPackagesAsync();
        Task<(int, Package)> GetPackageByIdAsync(int id);
        Task<int?> CreatePackageAsync(NewPackage package);
        Task<(int, string)> UpdatePackageAsync(int id, UpdatePackage package);
        Task<(bool,string)> DeletePackageAsync(int id);

        Task<List<Package>> GetPackageByPlaceIdAsync(int placeId);
    }
}


