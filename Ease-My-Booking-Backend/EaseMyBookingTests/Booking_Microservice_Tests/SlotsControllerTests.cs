using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Booking_Services.Controllers;
using Booking_Services.Models;
using Booking_Services.Models.DTO_Slots;
using Booking_Services.Repository.SlotsRepo;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Booking_Microservices_Tests
{
    [TestFixture]
    public class SlotsControllerTests
    {
        private Mock<ISlotsRepository> _mockRepo;
        private SlotsController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<ISlotsRepository>();
            _controller = new SlotsController(_mockRepo.Object);
        }

        [Test]
        public async Task AddSlots_ValidData_ReturnsOk()
        {
            var newSlot = new NewSlots { PackageId = 1, Date = DateOnly.FromDateTime(DateTime.Today), TimeFrom = new TimeOnly(9, 0), TimeTo = new TimeOnly(10, 0), MaxTicket = 10 };
            _mockRepo.Setup(r => r.CreateSlotAsync(newSlot)).ReturnsAsync(1);

            var result = await _controller.AddSlots(newSlot) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task AddSlots_InvalidData_ReturnsBadRequest()
        {
            var result = await _controller.AddSlots(null) as BadRequestObjectResult;
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task UpdateSlot_ValidData_ReturnsOk()
        {
            var updateSlot = new UpdateSlots { Date = DateOnly.FromDateTime(DateTime.Today), TimeFrom = new TimeOnly(9, 0), TimeTo = new TimeOnly(10, 0), MaxTicket = 10 };
            _mockRepo.Setup(r => r.UpdateSlotAsync(1, updateSlot)).ReturnsAsync("updated");

            var result = await _controller.UpdateSlot(1, updateSlot) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task UpdateSlot_InvalidId_ReturnsBadRequest()
        {
            var updateSlot = new UpdateSlots();
            var result = await _controller.UpdateSlot(0, updateSlot) as BadRequestObjectResult;
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task GetSlotsByPackageId_ValidId_ReturnsOk()
        {
            var slots = new List<Slots> { new Slots { SlotsId = 1, PackageId = 1 } };
            _mockRepo.Setup(r => r.GetSlotsByPackageIdAsync(1)).ReturnsAsync(slots);

            var actionResult = await _controller.GetSlotsByPackageId(1);
            var result = actionResult.Result as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task GetSlotsByPackageId_InvalidId_ReturnsBadRequest()
        {
            var result = await _controller.GetSlotsByPackageId(0);
            var badRequest = result.Result as BadRequestObjectResult;

            ClassicAssert.IsNotNull(badRequest);
            ClassicAssert.AreEqual(400, badRequest.StatusCode);
        }

        [Test]
        public async Task GetSlotsByPackageId_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetSlotsByPackageIdAsync(2)).ReturnsAsync(new List<Slots>());

            var actionResult = await _controller.GetSlotsByPackageId(2);
            var notFound = actionResult.Result as NotFoundObjectResult;

            ClassicAssert.IsNotNull(notFound);
            ClassicAssert.AreEqual(404, notFound.StatusCode);
        }

        [Test]
        public async Task DeleteSlot_ValidId_ReturnsOk()
        {
            _mockRepo.Setup(r => r.DeleteSlotAsync(1)).ReturnsAsync(true);

            var result = await _controller.DeleteSlot(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task DeleteSlot_InvalidId_ReturnsBadRequest()
        {
            var result = await _controller.DeleteSlot(0) as BadRequestObjectResult;
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task DeleteSlot_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.DeleteSlotAsync(2)).ReturnsAsync(false);

            var result = await _controller.DeleteSlot(2) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task GetAllSlots_ReturnsOk()
        {
            var slots = new List<Slots> { new Slots { SlotsId = 1, PackageId = 1 } };
            _mockRepo.Setup(r => r.GetAllSlotsAsync()).ReturnsAsync(slots);

            var actionResult = await _controller.GetAllSlots();
            var result = actionResult.Result as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task DeleteSlotByPackageId_ValidId_ReturnsOk()
        {
            _mockRepo.Setup(r => r.DeleteSlotByPackageId(1)).ReturnsAsync(true);

            var result = await _controller.DeleteSlotByPackageId(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task DeleteSlotByPackageId_InvalidId_ReturnsBadRequest()
        {
            var result = await _controller.DeleteSlotByPackageId(0) as BadRequestObjectResult;
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task DeleteSlotByPackageId_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.DeleteSlotByPackageId(2)).ReturnsAsync(false);

            var result = await _controller.DeleteSlotByPackageId(2) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }
    }
}
