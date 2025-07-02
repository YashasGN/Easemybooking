using Account_MicroService.Data;
using Account_MicroService.Model;
using Account_MicroService.Model.DTO;
using Account_MicroService.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using NUnit.Framework.Legacy;


namespace EaseMyBooking_Tests.Account_Microservice_Tests
{
    [TestFixture]
    public class AccountRepositoryTests
    {
        private Mock<UserManager<ApplicationUser>> _userManagerMock;
        private Mock<RoleManager<IdentityRole>> _roleManagerMock;
        private Mock<IConfiguration> _configurationMock;
        private AccountDBContext _dbContext;
        private AccountRepository _repository;

        [SetUp]
        public void SetUp()
        {
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _userManagerMock = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null, null, null, null, null, null, null, null);

            var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
            _roleManagerMock = new Mock<RoleManager<IdentityRole>>(roleStoreMock.Object, null, null, null, null);

            var inMemoryOptions = new DbContextOptionsBuilder<AccountDBContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new AccountDBContext(inMemoryOptions);

            _configurationMock = new Mock<IConfiguration>();
            _configurationMock.Setup(c => c["JWT:secret"]).Returns("supersecretkeysupersecretkey1234");
            _configurationMock.Setup(c => c["JWT:validIssuer"]).Returns("TestIssuer");
            _configurationMock.Setup(c => c["JWT:validAudience"]).Returns("TestAudience");

            _repository = new AccountRepository(_dbContext, _userManagerMock.Object, _roleManagerMock.Object, _configurationMock.Object);
        }

        [Test]
        public async Task LoginAsync_ReturnsInvalidEmail_WhenUserNotFound()
        {
            _userManagerMock.Setup(x => x.FindByNameAsync(It.IsAny<string>())).ReturnsAsync((ApplicationUser)null);

            var result = await _repository.LoginAsync(new LoginDTO { UserName = "notfound", Password = "pass" });

            ClassicAssert.AreEqual("0", result.UserId);
            ClassicAssert.AreEqual("Invalid Email ", result.Token);
        }

        [Test]
        public async Task LoginAsync_ReturnsInvalidPassword_WhenPasswordIncorrect()
        {
            var user = new ApplicationUser { Id = "1", UserName = "user", Email = "user@email.com" };
            _userManagerMock.Setup(x => x.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
            _userManagerMock.Setup(x => x.CheckPasswordAsync(user, It.IsAny<string>())).ReturnsAsync(false);

            var result = await _repository.LoginAsync(new LoginDTO { UserName = "user", Password = "wrongpass" });

            ClassicAssert.AreEqual("0", result.UserId);
            ClassicAssert.AreEqual("Invalid Password", result.Token);
        }

        [Test]
        public async Task LoginAsync_ReturnsToken_WhenCredentialsAreValid()
        {
            var user = new ApplicationUser { Id = "1", UserName = "user", Email = "user@email.com" };
            _userManagerMock.Setup(x => x.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
            _userManagerMock.Setup(x => x.CheckPasswordAsync(user, It.IsAny<string>())).ReturnsAsync(true);
            _userManagerMock.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(new List<string> { "User" });

            var result = await _repository.LoginAsync(new LoginDTO { UserName = "user", Password = "pass" });

            ClassicAssert.AreEqual("1", result.UserId);
            ClassicAssert.IsFalse(string.IsNullOrEmpty(result.Token));
            ClassicAssert.Contains("User", result.Role);
        }

        [Test]
        public async Task RegisterAsync_ReturnsUserCreated_WhenUserDoesNotExist()
        {
            _userManagerMock.Setup(x => x.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync((ApplicationUser)null);
            _roleManagerMock.Setup(x => x.RoleExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
            _roleManagerMock.Setup(x => x.CreateAsync(It.IsAny<IdentityRole>())).ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);

            var newUser = new NewUserDTO { UserName = "newuser", Email = "new@user.com", Password = "pass" };
            var (result, message) = await _repository.RegisterAsync(newUser, "User");

            ClassicAssert.AreEqual(1, result);
            ClassicAssert.AreEqual("user Created Succesfully", message);
        }

        [Test]
        public async Task RegisterAsync_ReturnsUserAlreadyExist_WhenUserExists()
        {
            _userManagerMock.Setup(x => x.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(new ApplicationUser());

            var newUser = new NewUserDTO { UserName = "existing", Email = "exist@user.com", Password = "pass" };
            var (result, message) = await _repository.RegisterAsync(newUser, "User");

            ClassicAssert.AreEqual(0, result);
            ClassicAssert.AreEqual("User Already Exist", message);
        }

        [Test]
        public async Task UpdateRoleAsync_ReturnsUserNotFound_WhenUserDoesNotExist()
        {
            _userManagerMock.Setup(x => x.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync((ApplicationUser)null);

            var result = await _repository.UpdateRoleAsync("notfound@email.com", "Admin");

            ClassicAssert.AreEqual("User not found", result);
        }

        [Test]
        public async Task UpdateRoleAsync_AddsRole_WhenUserDoesNotHaveRole()
        {
            var user = new ApplicationUser { Id = "1", Email = "user@email.com" };
            _userManagerMock.Setup(x => x.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);
            _roleManagerMock.Setup(x => x.RoleExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
            _roleManagerMock.Setup(x => x.CreateAsync(It.IsAny<IdentityRole>())).ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(x => x.IsInRoleAsync(user, "Admin")).ReturnsAsync(false);
            _userManagerMock.Setup(x => x.AddToRoleAsync(user, "Admin")).ReturnsAsync(IdentityResult.Success);

            var result = await _repository.UpdateRoleAsync("user@email.com", "Admin");

            ClassicAssert.AreEqual("Role updated successfully", result);
        }

        [Test]
        public async Task UpdateRoleAsync_ReturnsAlreadyHasRole_WhenUserAlreadyHasRole()
        {
            var user = new ApplicationUser { Id = "1", Email = "user@email.com" };
            _userManagerMock.Setup(x => x.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);
            _roleManagerMock.Setup(x => x.RoleExistsAsync(It.IsAny<string>())).ReturnsAsync(true);
            _userManagerMock.Setup(x => x.IsInRoleAsync(user, "Admin")).ReturnsAsync(true);

            var result = await _repository.UpdateRoleAsync("user@email.com", "Admin");

            ClassicAssert.AreEqual("User already has the role", result);
        }
    }
}
