using System.Threading.Tasks;
using Account_MicroService.Controllers;
using Account_MicroService.Model.DTO;
using Account_MicroService.Repository;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using NUnit.Framework.Legacy;


namespace EaseMyBooking_Tests.Account_Microservice_Tests
{
    [TestFixture]
    public class AccountControllerTests
    {
        private Mock<IAccountRepository> _mockRepo;
        private AccountController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<IAccountRepository>();
            _controller = new AccountController(_mockRepo.Object);
        }

        [Test]
        public async Task Register_ReturnsOk_WhenUserRegistered()
        {
            var newUser = new NewUserDTO { UserName = "test", Email = "test@test.com", Password = "pass" };
            _mockRepo.Setup(r => r.RegisterAsync(newUser, It.IsAny<string>()))
                .ReturnsAsync((1, "User registered successfully"));

            var result = await _controller.Register(newUser) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
            Assert.That(result.Value, Is.Not.Null);
        }

        [Test]
        public async Task Login_ReturnsOk_WhenLoginSuccessful()
        {
            var login = new LoginDTO { UserName = "test", Password = "pass" };
            var response = new LoginResponseDTO { UserId = "1", Token = "token", Role = new List<string> { "User" } };
            _mockRepo.Setup(r => r.LoginAsync(login)).ReturnsAsync(response);

            var result = await _controller.Login(login) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
            Assert.That(result.Value, Is.Not.Null);
        }

        [Test]
        public async Task Login_ReturnsUnauthorized_WhenLoginFails()
        {
            var login = new LoginDTO { UserName = "test", Password = "wrong" };
            var response = new LoginResponseDTO { UserId = "0", Token = "Invalid credentials", Role = new List<string>() };
            _mockRepo.Setup(r => r.LoginAsync(login)).ReturnsAsync(response);

            var result = await _controller.Login(login) as UnauthorizedObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(401, result.StatusCode);
            Assert.That(result.Value, Is.Not.Null);
        }

        [Test]
        public async Task UpdateRole_ReturnsNotFound_WhenUserNotFound()
        {
            _mockRepo.Setup(r => r.UpdateRoleAsync("notfound@test.com", "Admin"))
                .ReturnsAsync("User not found");

            var result = await _controller.UpdateRole("notfound@test.com", "Admin") as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task UpdateRole_ReturnsConflict_WhenUserAlreadyHasRole()
        {
            _mockRepo.Setup(r => r.UpdateRoleAsync("test@test.com", "User"))
                .ReturnsAsync("User already has the role");

            var result = await _controller.UpdateRole("test@test.com", "User") as ConflictObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(409, result.StatusCode);
        }

        [Test]
        public async Task UpdateRole_ReturnsOk_WhenRoleUpdated()
        {
            _mockRepo.Setup(r => r.UpdateRoleAsync("test@test.com", "Admin"))
                .ReturnsAsync("Role updated successfully");

            var result = await _controller.UpdateRole("test@test.com", "Admin") as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }
    }
}
