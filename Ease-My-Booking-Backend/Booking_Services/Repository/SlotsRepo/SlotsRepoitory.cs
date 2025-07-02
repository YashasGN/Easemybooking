using Microsoft.AspNetCore.Mvc.Infrastructure;
using Booking_Services.Data;
using Booking_Services.Models;
using Booking_Services.Models.DTO_Slots;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Booking_Services.Repository.SlotsRepo
{
    public class SlotsRepository : ISlotsRepository
    {
        private readonly BookingDBContext _slotsDbContext;
        private readonly IMapper _mapper;
        public SlotsRepository(BookingDBContext slotsDbContext, IMapper mapper)
        {
            _slotsDbContext = slotsDbContext;
            _mapper = mapper;
        }

        public async Task<int?> CreateSlotAsync(NewSlots slot)
        {
            try
            {
                Slots newSlot = new Slots();
                _mapper.Map(slot, newSlot);
                //newSlot.IsActive = "false";
                //newSlot.IsVerified = "false";

                await _slotsDbContext.Slots.AddAsync(newSlot);
                await _slotsDbContext.SaveChangesAsync();
                return newSlot.SlotsId;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> DeleteSlotAsync(int slotid)
        {
            try
            {
                var slot = await _slotsDbContext.Slots.FindAsync(slotid); // ✅ correct variable name
                if (slot == null)
                {
                    return false;
                }

                _slotsDbContext.Slots.Remove(slot); // ✅ ACTUAL DELETE LINE
                await _slotsDbContext.SaveChangesAsync(); // ✅ persists the deletion
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        public async Task<IEnumerable<Slots>> GetAllSlotsAsync()
        {
            try
            {
                return await _slotsDbContext.Slots.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving slots: {ex.Message}");
            }
        }

       public async Task<List<Slots>> GetSlotsByPackageIdAsync(int packageId)
        {
            try
            {
                return await _slotsDbContext.Slots
                    .Where(s => s.PackageId == packageId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving slots for package ID {packageId}: {ex.Message}");
            }
        }

        //public Task<Slots> GetSlotsByPackageIdAsync(int packageId)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task<string> UpdateSlotAsync(int id, UpdateSlots slot)
        {
            var existingSlot = await _slotsDbContext.Slots.FindAsync(id);
            if (existingSlot == null)
                return "Slot not found";

            try
            {
                // Map updated properties from slot (DTO) to existingSlot (entity)
                _mapper.Map(slot, existingSlot);

                // EF Core tracks existingSlot, so no need to explicitly set state here
                await _slotsDbContext.SaveChangesAsync();

                return "Slot Updated Successfully";
            }
            catch (Exception ex)
            {
                return $"Error Updating Slot: {ex.Message}";
            }
        }


        public async Task<bool> DeleteSlotByPackageId(int packageId)
        {
            try
            {
                var slots = await _slotsDbContext.Slots
                    .Where(s => s.PackageId == packageId)
                    .ToListAsync();
                if (!slots.Any())
                    return false;
                _slotsDbContext.Slots.RemoveRange(slots);
                await _slotsDbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }



        }
}


