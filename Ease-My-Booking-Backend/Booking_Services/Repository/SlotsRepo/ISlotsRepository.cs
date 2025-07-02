using Booking_Services.Models;
using Booking_Services.Models.DTO_Slots;

namespace Booking_Services.Repository.SlotsRepo
{
    public interface ISlotsRepository
    {
        Task<IEnumerable<Slots>>GetAllSlotsAsync();
        Task<List<Slots>>GetSlotsByPackageIdAsync(int packageId);
        Task<int?> CreateSlotAsync(NewSlots slots);
        Task<string> UpdateSlotAsync(int id, UpdateSlots slot);
        Task<bool> DeleteSlotAsync(int slotId);
        Task<bool>DeleteSlotByPackageId(int packageId);
    }
}
