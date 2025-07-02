using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using Package_MicroService.Controllers;
using Package_MicroService.Models.DTO;
using Package_MicroService.Repository;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Package_Microservice_Tests
{
    [TestFixture]
    public class PackageControllerTests
    {
        private Mock<IPackageRepository> _mockRepo;
        private PackageController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<IPackageRepository>();
            _controller = new PackageController(_mockRepo.Object);
        }

        [Test]
        public async Task AddPackage_ValidPackage_ReturnsOk()
        {
            var newPackage = new NewPackage { PackageName = "Test", PlaceId = 1 };
            _mockRepo.Setup(r => r.CreatePackageAsync(newPackage)).ReturnsAsync(1);

            var result = await _controller.AddPackage(newPackage) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task AddPackage_NullPackage_ReturnsBadRequest()
        {
            var result = await _controller.AddPackage(null) as BadRequestObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task UpdatePackage_Valid_ReturnsOk()
        {
            var updatePackage = new UpdatePackage { PackageName = "Updated" };
            _mockRepo.Setup(r => r.UpdatePackageAsync(1, updatePackage)).ReturnsAsync((1, "Updated"));

            var result = await _controller.UpdatePackage(1, updatePackage) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task UpdatePackage_InvalidId_ReturnsBadRequest()
        {
            var updatePackage = new UpdatePackage { PackageName = "Updated" };

            var result = await _controller.UpdatePackage(0, updatePackage) as BadRequestObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task GetPackageById_Found_ReturnsOk()
        {
            var package = new Package { Id = 1, PackageName = "Test" };
            _mockRepo.Setup(r => r.GetPackageByIdAsync(1)).ReturnsAsync((1, package));

            var result = await _controller.GetPackageById(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task GetPackageById_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetPackageByIdAsync(1)).ReturnsAsync((0, null));

            var result = await _controller.GetPackageById(1) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task DeletePackageById_Found_ReturnsOk()
        {
            var package = new Package { Id = 1 };
            _mockRepo.Setup(r => r.DeletePackageAsync(1)).ReturnsAsync((true, "Deleted"));

            var result = await _controller.DeletePackageById(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task DeletePackageById_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.DeletePackageAsync(1)).ReturnsAsync((false, "Not found"));

            var result = await _controller.DeletePackageById(1) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task GetAllPackage_Found_ReturnsOk()
        {
            var packages = new List<Package> { new Package { Id = 1 } };
            _mockRepo.Setup(r => r.GetAllPackagesAsync()).ReturnsAsync(packages);

            var result = await _controller.GetAllPackage() as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task GetAllPackage_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetAllPackagesAsync()).ReturnsAsync(new List<Package>());

            var result = await _controller.GetAllPackage() as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task GetPackageByPlaceId_Valid_ReturnsOk()
        {
            var packages = new List<Package> { new Package { Id = 1, PlaceId = 1 } };
            _mockRepo.Setup(r => r.GetPackageByPlaceIdAsync(1)).ReturnsAsync(packages);

            var result = await _controller.GetPackageByPlaceId(1) as OkObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task GetPackageByPlaceId_InvalidId_ReturnsBadRequest()
        {
            var result = await _controller.GetPackageByPlaceId(0) as BadRequestObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task GetPackageByPlaceId_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetPackageByPlaceIdAsync(1)).ReturnsAsync(new List<Package>());

            var result = await _controller.GetPackageByPlaceId(1) as NotFoundObjectResult;

            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(404, result.StatusCode);
        }
    }
}
