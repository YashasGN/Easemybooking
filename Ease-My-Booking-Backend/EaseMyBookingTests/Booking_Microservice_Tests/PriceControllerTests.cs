using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Booking_Services.Controllers;
using Booking_Services.Models;
using Booking_Services.Models.DTO_Price;
using Booking_Services.Repository.PriceRepo;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Booking_Microservices_Tests
{
    [TestFixture]
    public class PriceControllerTests
    {
        private Mock<IPriceRepository> _mockRepo;
        private PriceController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<IPriceRepository>();
            _controller = new PriceController(_mockRepo.Object);
        }

        [Test]
        public async Task AddPrice_Valid_ReturnsOk()
        {
            var newPrice = new NewPrice { PackageId = 1, SlotId = 1, PriceChildren = 10, PriceAdults = 20, PriceForeign = 30, PriceSenior = 15 };
            _mockRepo.Setup(r => r.CreatePriceAsync(newPrice)).ReturnsAsync(5);

            var result = await _controller.AddPrice(newPrice) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task AddPrice_Invalid_ReturnsBadRequest()
        {
            var result = await _controller.AddPrice(null) as BadRequestObjectResult;
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task UpdatePrice_Valid_ReturnsOk()
        {
            var update = new UpdatePrice { PriceChildren = 10, PriceAdults = 20, PriceForeign = 30, PriceSenior = 15 };
            _mockRepo.Setup(r => r.UpdatePriceAsync(1, update)).ReturnsAsync("Updated successfully");

            var result = await _controller.UpdatePrice(1, update) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task UpdatePrice_NotFound_ReturnsNotFound()
        {
            var update = new UpdatePrice();
            _mockRepo.Setup(r => r.UpdatePriceAsync(1, update)).ReturnsAsync("Price not found");

            var result = await _controller.UpdatePrice(1, update) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task GetPriceByPackageId_Valid_ReturnsOk()
        {
            var price = new Price { PriceId = 1, PackageId = 1 };
            _mockRepo.Setup(r => r.GetPriceByPackageIdAsync(1)).ReturnsAsync(price);

            var result = await _controller.GetPriceByPackageId(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task GetPriceByPackageId_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetPriceByPackageIdAsync(1)).ReturnsAsync((Price)null);

            var result = await _controller.GetPriceByPackageId(1) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task GetAllPrice_Empty_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetAllPriceAsync()).ReturnsAsync(new List<Price>());

            var result = await _controller.GetAllPrice() as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task GetAllPrice_Valid_ReturnsOk()
        {
            var prices = new List<Price> { new Price { PriceId = 1, PackageId = 1 } };
            _mockRepo.Setup(r => r.GetAllPriceAsync()).ReturnsAsync(prices);

            var result = await _controller.GetAllPrice() as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task DeletePriceByPackageId_Valid_ReturnsOk()
        {
            _mockRepo.Setup(r => r.DeletePriceByPackageIdAsync(1)).ReturnsAsync(true);

            var result = await _controller.DeletePriceByPackageId(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task DeletePriceByPackageId_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.DeletePriceByPackageIdAsync(1)).ReturnsAsync(false);

            var result = await _controller.DeletePriceByPackageId(1) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task DeletePriceBySlotId_Valid_ReturnsOk()
        {
            _mockRepo.Setup(r => r.DeletePriceBySlotIdAsync(1)).ReturnsAsync(true);

            var result = await _controller.DeletePriceBySlotId(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task DeletePriceBySlotId_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.DeletePriceBySlotIdAsync(1)).ReturnsAsync(false);

            var result = await _controller.DeletePriceBySlotId(1) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task GetPriceBySlotId_Valid_ReturnsOk()
        {
            var prices = new List<Price> { new Price { PriceId = 1, SlotId = 1 } };
            _mockRepo.Setup(r => r.GetPriceBySlotIdAsync(1)).ReturnsAsync(prices);

            var result = await _controller.GetPriceBySlotId(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task GetPriceBySlotId_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetPriceBySlotIdAsync(1)).ReturnsAsync(new List<Price>());

            var result = await _controller.GetPriceBySlotId(1) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }
    }
}
