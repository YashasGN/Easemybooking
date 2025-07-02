using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Booking_Services.Models;
using Booking_Services.Models.DTO_Price;
using Booking_Services.Repository.PriceRepo;
using Moq;
using NUnit.Framework;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Booking_Microservices_Tests
{
    [TestFixture]
    public class PriceRepositoryTests
    {
        private Mock<IPriceRepository> _mockRepo;

        [SetUp]
        public void Setup()
        {
            _mockRepo = new Mock<IPriceRepository>();
        }

        [Test]
        public async Task CreatePriceAsync_ShouldReturnValidId()
        {
            var newPrice = new NewPrice
            {
                PackageId = 1,
                SlotId = 1,
                PriceChildren = 10,
                PriceAdults = 20,
                PriceForeign = 30,
                PriceSenior = 15,
                CreatedAt = DateTime.UtcNow
            };

            _mockRepo.Setup(repo => repo.CreatePriceAsync(newPrice)).ReturnsAsync(101);

            var result = await _mockRepo.Object.CreatePriceAsync(newPrice);
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(101, result);
        }

        [Test]
        public async Task UpdatePriceAsync_ShouldReturnSuccessMessage()
        {
            var update = new UpdatePrice
            {
                PriceChildren = 50,
                PriceAdults = 100,
                PriceForeign = 150,
                PriceSenior = 80
            };

            _mockRepo.Setup(repo => repo.UpdatePriceAsync(2, update))
                     .ReturnsAsync("Price updated successfully");

            var result = await _mockRepo.Object.UpdatePriceAsync(2, update);
            ClassicAssert.AreEqual("Price updated successfully", result);
        }

        [Test]
        public async Task GetAllPriceAsync_ShouldReturnAllPrices()
        {
            var prices = new List<Price>
            {
                new Price { PackageId = 3, SlotId = 3 },
                new Price { PackageId = 4, SlotId = 4 }
            };

            _mockRepo.Setup(repo => repo.GetAllPriceAsync()).ReturnsAsync(prices);

            var result = await _mockRepo.Object.GetAllPriceAsync();
            ClassicAssert.AreEqual(2, result.Count());
        }

        [Test]
        public async Task GetPriceByPackageIdAsync_ShouldReturnCorrectPrice()
        {
            var price = new Price { PackageId = 5, SlotId = 5 };

            _mockRepo.Setup(repo => repo.GetPriceByPackageIdAsync(5)).ReturnsAsync(price);

            var result = await _mockRepo.Object.GetPriceByPackageIdAsync(5);

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(5, result.PackageId);
        }

        [Test]
        public async Task DeletePriceByPackageIdAsync_ShouldReturnTrue()
        {
            _mockRepo.Setup(repo => repo.DeletePriceByPackageIdAsync(6)).ReturnsAsync(true);

            var result = await _mockRepo.Object.DeletePriceByPackageIdAsync(6);

            ClassicAssert.IsTrue(result);
        }

        [Test]
        public async Task DeletePriceBySlotIdAsync_ShouldReturnTrue()
        {
            _mockRepo.Setup(repo => repo.DeletePriceBySlotIdAsync(7)).ReturnsAsync(true);

            var result = await _mockRepo.Object.DeletePriceBySlotIdAsync(7);

            ClassicAssert.IsTrue(result);
        }

        [Test]
        public async Task GetPriceBySlotIdAsync_ShouldReturnList()
        {
            var prices = new List<Price>
            {
                new Price { PackageId = 8, SlotId = 8 },
                new Price { PackageId = 9, SlotId = 8 }
            };

            _mockRepo.Setup(repo => repo.GetPriceBySlotIdAsync(8)).ReturnsAsync(prices);

            var result = await _mockRepo.Object.GetPriceBySlotIdAsync(8);

            ClassicAssert.AreEqual(2, result.Count);
        }
    }
}
