using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using Account_MicroService.Controllers;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Account_Microservice_Tests
{
    [TestFixture]
    public class UsersControllerTests
    {
        private UsersController _controller;

        [SetUp]
        public void SetUp()
        {
            _controller = new UsersController();
        }

        [Test]
        public async Task GetUsers_ReturnsOkResult_WithExpectedContent()
        {
            // Act
            var result = await _controller.GetUsers();

            // Assert
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            ClassicAssert.AreEqual("Get All users From DB", okResult.Value);
        }

        [Test]
        public async Task GetUserById_ReturnsOkResult_WithSuccessMessage()
        {
            // Arrange
            int testId = 1;

            // Act
            var result = await _controller.GetUserById(testId);

            // Assert
            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            ClassicAssert.AreEqual("Sucess", okResult.Value);
        }
    }
}
