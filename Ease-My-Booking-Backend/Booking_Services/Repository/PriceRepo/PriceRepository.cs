using Booking_Services.Data;
using Booking_Services.Models;
using Booking_Services.Models.DTO_Price;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Diagnostics;

namespace Booking_Services.Repository.PriceRepo
{
    public class PriceRepository : IPriceRepository
    {
        private readonly BookingDBContext _priceDbContext;
        private readonly IMapper _mapper;

        public PriceRepository(BookingDBContext priceDbContext, IMapper mapper)
        {
            _priceDbContext = priceDbContext;
            _mapper = mapper;
        }

        public async Task<int?> CreatePriceAsync(NewPrice price)
        {
            Price newPrice = new Price();
            _mapper.Map(price, newPrice);

            await _priceDbContext.Prices.AddAsync(newPrice);
            await _priceDbContext.SaveChangesAsync();

            return newPrice.PriceId;
        }

        public async Task<string> UpdatePriceAsync(int slotId, UpdatePrice price)
        {
            // Find the price based on SlotId
            var existingPrice = await _priceDbContext.Prices
                .FirstOrDefaultAsync(p => p.SlotId == slotId);

            if (existingPrice == null)
                return "Price not found for the given SlotId";

            // Update the entity using AutoMapper or manually
            _mapper.Map(price, existingPrice);

            // Update the timestamp
            existingPrice.UpdatedAt = DateTime.Now;

            try
            {
                await _priceDbContext.SaveChangesAsync();
                return "Price updated successfully";
            }
            catch (Exception ex)
            {
                return $"Error updating price: {ex.Message}";
            }
        }


        public async Task<IEnumerable<Price>> GetAllPriceAsync()
        {
            try
            {
                return await _priceDbContext.Prices.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving price: {ex.Message}");
            }
        }

        public async Task<Price?> GetPriceByPackageIdAsync(int packageId)
        {
            try
            {
                return await _priceDbContext.Prices.FirstOrDefaultAsync(p => p.PackageId == packageId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving price for package ID {packageId}: {ex.Message}");
            }
        }

        public async Task<bool> DeletePriceByPackageIdAsync(int packageId)
        {
            try
            {
                var prices = await _priceDbContext.Prices
                    .Where(p => p.PackageId == packageId)
                    .ToListAsync();

                if (!prices.Any())
                    return false;

                _priceDbContext.Prices.RemoveRange(prices);
                await _priceDbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeletePriceBySlotIdAsync(int slotId)
        {
            try
            {
                var price = await _priceDbContext.Prices
                    .Where(p => p.SlotId == slotId)
                    .ToListAsync();
                if (!price.Any())
                    return false;
                _priceDbContext.Prices.RemoveRange(price);
                await _priceDbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<Price>> GetPriceBySlotIdAsync(int slotId)
        {
            try
            {
                return await _priceDbContext.Prices
                    .Where(p => p.SlotId == slotId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving price for slot ID {slotId}: {ex.Message}");
            }


        }
    }
}
