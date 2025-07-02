using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using NUnit.Framework.Legacy;
using Places_Services.Controllers;
using Places_Services.Models;
using Places_Services.Models.DTO_Places;
using Places_Services.Repository;

namespace EaseMyBooking_Tests.Place_Microservice_Tests
{
    [TestFixture]
    public class PlacesControllerTests
    {
        private Mock<IPlacesRepository> _mockRepo;
        private PlacesController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<IPlacesRepository>();
            _controller = new PlacesController(_mockRepo.Object);
        }

        [Test]
        public async Task AddPlace_NullInput_ReturnsBadRequest()
        {
            var result = await _controller.AddPlace(null);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task AddPlace_InvalidInput_ReturnsBadRequest()
        {
            var newPlace = new NewPlaces { PlaceName = "", City = "", CategoryId = 0 };
            var result = await _controller.AddPlace(newPlace);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task AddPlace_ValidInput_ReturnsOk()
        {
            var newPlace = new NewPlaces { PlaceName = "Test", City = "TestCity", CategoryId = 1 };
            _mockRepo.Setup(r => r.CreatePlaceAsync(newPlace)).ReturnsAsync(1);
            var result = await _controller.AddPlace(newPlace);
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCity_NullOrEmpty_ReturnsBadRequest()
        {
            var result = await _controller.GetPlaceByCity("");
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCity_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetPlaceByCityAsync("NoCity")).ReturnsAsync((Place)null);
            var result = await _controller.GetPlaceByCity("NoCity");
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCity_Found_ReturnsOk()
        {
            var place = new Place { Id = 1, PlaceName = "Test", City = "TestCity" };
            _mockRepo.Setup(r => r.GetPlaceByCityAsync("TestCity")).ReturnsAsync(place);
            var result = await _controller.GetPlaceByCity("TestCity");
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task UpdatePlace_NullInput_ReturnsBadRequest()
        {
            var result = await _controller.UpdatePlace(1, null);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task UpdatePlace_PlaceNotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.UpdatePlaceAsync(1, It.IsAny<UpdatePlaces>())).ReturnsAsync("Place not found");
            var result = await _controller.UpdatePlace(1, new UpdatePlaces());
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task UpdatePlace_Success_ReturnsOk()
        {
            _mockRepo.Setup(r => r.UpdatePlaceAsync(1, It.IsAny<UpdatePlaces>())).ReturnsAsync("Place updated successfully");
            var result = await _controller.UpdatePlace(1, new UpdatePlaces());
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task DeletePlace_InvalidId_ReturnsBadRequest()
        {
            var result = await _controller.DeletePlace(0);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task DeletePlace_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.DeletePlaceAsync(1)).ReturnsAsync(false);
            var result = await _controller.DeletePlace(1);
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task DeletePlace_Success_ReturnsOk()
        {
            _mockRepo.Setup(r => r.DeletePlaceAsync(1)).ReturnsAsync(true);
            var result = await _controller.DeletePlace(1);
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetAllPlaces_Empty_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetAllPlacesAsync()).ReturnsAsync(new List<Place>());
            var result = await _controller.GetAllPlaces();
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task GetAllPlaces_Found_ReturnsOk()
        {
            _mockRepo.Setup(r => r.GetAllPlacesAsync()).ReturnsAsync(new List<Place> { new Place() });
            var result = await _controller.GetAllPlaces();
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCategory_NullOrEmpty_ReturnsBadRequest()
        {
            var result = await _controller.GetPlaceByCategory("");
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCategory_Empty_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetPlaceByCategoryAsync("cat")).ReturnsAsync(new List<Place>());
            var result = await _controller.GetPlaceByCategory("cat");
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCategory_Found_ReturnsOk()
        {
            _mockRepo.Setup(r => r.GetPlaceByCategoryAsync("cat")).ReturnsAsync(new List<Place> { new Place() });
            var result = await _controller.GetPlaceByCategory("cat");
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCityAndCategory_NullOrEmpty_ReturnsBadRequest()
        {
            var result = await _controller.GetPlaceByCityAndCategory("", "");
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCityAndCategory_Empty_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetPlaceByCityAndCategoryAsync("city", "cat")).ReturnsAsync(new List<Place>());
            var result = await _controller.GetPlaceByCityAndCategory("city", "cat");
            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task GetPlaceByCityAndCategory_Found_ReturnsOk()
        {
            _mockRepo.Setup(r => r.GetPlaceByCityAndCategoryAsync("city", "cat")).ReturnsAsync(new List<Place> { new Place() });
            var result = await _controller.GetPlaceByCityAndCategory("city", "cat");
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
        }
    }
}
