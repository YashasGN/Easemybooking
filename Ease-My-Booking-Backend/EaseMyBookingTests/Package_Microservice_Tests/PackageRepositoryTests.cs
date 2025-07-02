using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Package_MicroService.Data;
using Package_MicroService.Models;
using Package_MicroService.Models.DTO;
using Package_MicroService.Repository;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Package_Microservice_Tests
{
    [TestFixture]
    public class PackageRepositoryTests
    {
        private PackageDbContext _dbContext;
        private IMapper _mapper;
        private PackageRepository _repository;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<PackageDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new PackageDbContext(options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<NewPackage, Package>();
                cfg.CreateMap<UpdatePackage, Package>();
            });
            _mapper = config.CreateMapper();

            _repository = new PackageRepository(_dbContext, _mapper);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreatePackageAsync_ShouldAddPackage()
        {
            var newPackage = new NewPackage
            {
                PackageName = "Test Package",
                Details = "Details",
                City = "Test City",
                PlaceId = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                ImageUrl = "url"
            };

            var id = await _repository.CreatePackageAsync(newPackage);

            ClassicAssert.IsNotNull(id);
            ClassicAssert.AreEqual(1, _dbContext.Package.Count());
        }

        [Test]
        public async Task GetAllPackagesAsync_ShouldReturnAllPackages()
        {
            _dbContext.Package.Add(new Package { PlaceId = 1, PackageName = "A", IsActive = true, CreatedAt = DateTime.UtcNow });
            _dbContext.Package.Add(new Package { PlaceId = 2, PackageName = "B", IsActive = true, CreatedAt = DateTime.UtcNow });
            await _dbContext.SaveChangesAsync();

            var result = await _repository.GetAllPackagesAsync();

            ClassicAssert.AreEqual(2, result.Count());
        }

        [Test]
        public async Task GetPackageByIdAsync_ShouldReturnPackage_WhenExists()
        {
            var package = new Package { PlaceId = 1, PackageName = "A", IsActive = true, CreatedAt = DateTime.UtcNow };
            _dbContext.Package.Add(package);
            await _dbContext.SaveChangesAsync();

            var (status, foundPackage) = await _repository.GetPackageByIdAsync(package.Id);

            ClassicAssert.AreEqual(1, status);
            ClassicAssert.IsNotNull(foundPackage);
            ClassicAssert.AreEqual(package.PackageName, foundPackage.PackageName);
        }

        [Test]
        public async Task GetPackageByIdAsync_ShouldReturnZero_WhenNotFound()
        {
            var (status, foundPackage) = await _repository.GetPackageByIdAsync(999);
            ClassicAssert.AreEqual(0, status);
            ClassicAssert.IsNull(foundPackage);
        }

        [Test]
        public async Task UpdatePackageAsync_ShouldUpdate_WhenExists()
        {
            var package = new Package { PlaceId = 1, PackageName = "A", IsActive = true, CreatedAt = DateTime.UtcNow };
            _dbContext.Package.Add(package);
            await _dbContext.SaveChangesAsync();

            var updateDto = new UpdatePackage
            {
                PackageName = "Updated",
                Details = "Updated details",
                ImageUrl = "newurl",
                UpdatedAt = DateTime.UtcNow
            };

            var (status, message) = await _repository.UpdatePackageAsync(package.Id, updateDto);

            ClassicAssert.AreEqual(1, status);
            ClassicAssert.AreEqual("Package Updated Successfully", message);
            var updated = await _dbContext.Package.FindAsync(package.Id);
            ClassicAssert.AreEqual("Updated", updated.PackageName);
        }

        [Test]
        public async Task UpdatePackageAsync_ShouldReturnZero_WhenNotFound()
        {
            var updateDto = new UpdatePackage
            {
                PackageName = "Updated",
                Details = "Updated details",
                ImageUrl = "newurl",
                UpdatedAt = DateTime.UtcNow
            };

            var (status, message) = await _repository.UpdatePackageAsync(999, updateDto);

            ClassicAssert.AreEqual(0, status);
            ClassicAssert.AreEqual("Package Not Found!", message);
        }

        [Test]
        public async Task DeletePackageAsync_ShouldDelete_WhenExists()
        {
            var package = new Package { PlaceId = 1, PackageName = "A", IsActive = true, CreatedAt = DateTime.UtcNow };
            _dbContext.Package.Add(package);
            await _dbContext.SaveChangesAsync();

            var (success, msg) = await _repository.DeletePackageAsync(package.Id);

            ClassicAssert.IsTrue(success);
            ClassicAssert.AreEqual(0, _dbContext.Package.Count());
        }

        [Test]
        public async Task DeletePackageAsync_ShouldReturnFalse_WhenNotFound()
        {
            var (success, msg) = await _repository.DeletePackageAsync(999);
            ClassicAssert.IsFalse(success);
            ClassicAssert.AreEqual("package not found", msg);
        }

        [Test]
        public async Task GetPackageByPlaceIdAsync_ShouldReturnPackagesForPlace()
        {
            _dbContext.Package.Add(new Package { PlaceId = 1, PackageName = "A", IsActive = true, CreatedAt = DateTime.UtcNow });
            _dbContext.Package.Add(new Package { PlaceId = 2, PackageName = "B", IsActive = true, CreatedAt = DateTime.UtcNow });
            await _dbContext.SaveChangesAsync();

            var result = await _repository.GetPackageByPlaceIdAsync(1);

            ClassicAssert.AreEqual(1, result.Count);
            ClassicAssert.AreEqual("A", result[0].PackageName);
        }
    }
}
