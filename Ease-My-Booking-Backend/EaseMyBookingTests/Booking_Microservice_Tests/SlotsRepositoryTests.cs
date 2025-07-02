using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Booking_Services.Data;
using Booking_Services.Models;
using Booking_Services.Models.DTO_Slots;
using Booking_Services.Repository.SlotsRepo;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Booking_Microservices_Tests
{
    [TestFixture]
    public class SlotsRepositoryTests
    {
        private BookingDBContext _dbContext;
        private IMapper _mapper;
        private SlotsRepository _repository;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<BookingDBContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new BookingDBContext(options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<NewSlots, Slots>();
                cfg.CreateMap<UpdateSlots, Slots>();
            });
            _mapper = config.CreateMapper();

            _repository = new SlotsRepository(_dbContext, _mapper);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreateSlotAsync_ShouldAddSlot()
        {
            var newSlot = new NewSlots
            {
                PackageId = 1,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(9, 0),
                TimeTo = new TimeOnly(10, 0),
                MaxTicket = 20,
                CreatedAt = DateTime.UtcNow
            };

            var slotId = await _repository.CreateSlotAsync(newSlot);

            ClassicAssert.IsNotNull(slotId);
            var slot = await _dbContext.Slots.FindAsync(slotId);
            ClassicAssert.IsNotNull(slot);
            ClassicAssert.AreEqual(newSlot.PackageId, slot.PackageId);
        }

        [Test]
        public async Task DeleteSlotAsync_ShouldDeleteSlot()
        {
            var slot = new Slots
            {
                PackageId = 1,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(9, 0),
                TimeTo = new TimeOnly(10, 0),
                MaxTicket = 10,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _dbContext.Slots.Add(slot);
            await _dbContext.SaveChangesAsync();

            var result = await _repository.DeleteSlotAsync(slot.SlotsId);

            ClassicAssert.IsTrue(result);
            ClassicAssert.IsNull(await _dbContext.Slots.FindAsync(slot.SlotsId));
        }

        [Test]
        public async Task GetAllSlotsAsync_ShouldReturnAllSlots()
        {
            _dbContext.Slots.Add(new Slots
            {
                PackageId = 1,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(9, 0),
                TimeTo = new TimeOnly(10, 0),
                MaxTicket = 10,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            _dbContext.Slots.Add(new Slots
            {
                PackageId = 2,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(11, 0),
                TimeTo = new TimeOnly(12, 0),
                MaxTicket = 15,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            await _dbContext.SaveChangesAsync();

            var slots = await _repository.GetAllSlotsAsync();

            ClassicAssert.AreEqual(2, slots.Count());
        }

        [Test]
        public async Task GetSlotsByPackageIdAsync_ShouldReturnCorrectSlots()
        {
            _dbContext.Slots.Add(new Slots
            {
                PackageId = 1,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(9, 0),
                TimeTo = new TimeOnly(10, 0),
                MaxTicket = 10,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            _dbContext.Slots.Add(new Slots
            {
                PackageId = 2,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(11, 0),
                TimeTo = new TimeOnly(12, 0),
                MaxTicket = 15,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            await _dbContext.SaveChangesAsync();

            var slots = await _repository.GetSlotsByPackageIdAsync(1);

            ClassicAssert.AreEqual(1, slots.Count);
            ClassicAssert.AreEqual(1, slots[0].PackageId);
        }

        [Test]
        public async Task UpdateSlotAsync_ShouldUpdateSlot()
        {
            var slot = new Slots
            {
                PackageId = 1,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(9, 0),
                TimeTo = new TimeOnly(10, 0),
                MaxTicket = 10,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _dbContext.Slots.Add(slot);
            await _dbContext.SaveChangesAsync();

            var updateDto = new UpdateSlots
            {
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
                TimeFrom = new TimeOnly(10, 0),
                TimeTo = new TimeOnly(11, 0),
                MaxTicket = 20
            };

            var result = await _repository.UpdateSlotAsync(slot.SlotsId, updateDto);

            ClassicAssert.AreEqual("Slot Updated Successfully", result);
            var updatedSlot = await _dbContext.Slots.FindAsync(slot.SlotsId);
            ClassicAssert.AreEqual(updateDto.MaxTicket, updatedSlot.MaxTicket);
            ClassicAssert.AreEqual(updateDto.Date, updatedSlot.Date);
        }

        [Test]
        public async Task DeleteSlotByPackageId_ShouldDeleteAllSlotsForPackage()
        {
            _dbContext.Slots.Add(new Slots
            {
                PackageId = 1,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(9, 0),
                TimeTo = new TimeOnly(10, 0),
                MaxTicket = 10,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            _dbContext.Slots.Add(new Slots
            {
                PackageId = 1,
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
                TimeFrom = new TimeOnly(11, 0),
                TimeTo = new TimeOnly(12, 0),
                MaxTicket = 15,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            _dbContext.Slots.Add(new Slots
            {
                PackageId = 2,
                Date = DateOnly.FromDateTime(DateTime.Today),
                TimeFrom = new TimeOnly(13, 0),
                TimeTo = new TimeOnly(14, 0),
                MaxTicket = 20,
                TicketBooked = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            await _dbContext.SaveChangesAsync();

            var result = await _repository.DeleteSlotByPackageId(1);

            ClassicAssert.IsTrue(result);
            ClassicAssert.AreEqual(1, _dbContext.Slots.Count());
            ClassicAssert.AreEqual(2, _dbContext.Slots.First().PackageId);
        }
    }
}
