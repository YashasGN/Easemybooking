using Booking_Services.Models;
using Booking_Services.Models.DTO_Price;

namespace Booking_Services.Repository.PriceRepo
{
    public interface IPriceRepository
    {
        Task<IEnumerable<Price>> GetAllPriceAsync();
        Task<Price> GetPriceByPackageIdAsync(int packageId);
        Task<int?> CreatePriceAsync(NewPrice price);
        Task<string> UpdatePriceAsync(int slotId, UpdatePrice price);
        Task<bool> DeletePriceByPackageIdAsync(int paackageId);
        Task<List<Price>> GetPriceBySlotIdAsync(int slotId);
        Task<bool> DeletePriceBySlotIdAsync(int slotId);
    }
}
