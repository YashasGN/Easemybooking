using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Places_Services.Data;
using Places_Services.Models;
using Places_Services.Models.DTO_Places;
using Places_Services.Repository;
using NUnit.Framework.Legacy;

namespace EaseMyBooking_Tests.Place_Microservice_Tests
{
    [TestFixture]
    public class PlacesRepositoryTests
    {
        private PlacesDBContext _dbContext;
        private IMapper _mapper;
        private PlacesRepository _repository;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<PlacesDBContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new PlacesDBContext(options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<NewPlaces, Place>();
            });
            _mapper = config.CreateMapper();

            // Seed categories
            _dbContext.Categories.Add(new Category { Id = 1, CategoryName = "Park", Description = "Parks", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            _dbContext.Categories.Add(new Category { Id = 2, CategoryName = "Museum", Description = "Museums", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            _dbContext.SaveChanges();

            _repository = new PlacesRepository(_dbContext, _mapper);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreatePlaceAsync_ShouldAddPlace()
        {
            var newPlace = new NewPlaces
            {
                CreatedBy = "user1",
                PlaceName = "Central Park",
                CategoryId = 1,
                City = "New York",
                State = "NY",
                Country = "USA",
                Address = "123 Park Ave",
                PinCode = 10001,
                Description = "A large park",
                ImageUrl = "http://image.com/park.jpg",
                CreatedAt = DateTime.UtcNow
            };

            var id = await _repository.CreatePlaceAsync(newPlace);

            ClassicAssert.IsNotNull(id);
            var place = await _dbContext.Places.FindAsync(id);
            ClassicAssert.IsNotNull(place);
            ClassicAssert.AreEqual("Central Park", place.PlaceName);
            ClassicAssert.IsFalse(place.IsActive);
            ClassicAssert.IsFalse(place.IsVerified);
            ClassicAssert.IsFalse(place.IsRejected);
        }

        [Test]
        public async Task DeletePlaceAsync_ShouldDeleteExistingPlace()
        {
            var place = new Place
            {
                CreatedBy = "user1",
                PlaceName = "Delete Me",
                CategoryId = 1,
                City = "City",
                State = "State",
                Country = "Country",
                Address = "Address",
                PinCode = 12345,
                Description = "Desc",
                ImageUrl = "img",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _dbContext.Places.Add(place);
            _dbContext.SaveChanges();

            var result = await _repository.DeletePlaceAsync(place.Id);
            ClassicAssert.IsTrue(result);
            ClassicAssert.IsNull(await _dbContext.Places.FindAsync(place.Id));
        }

        [Test]
        public async Task DeletePlaceAsync_ShouldReturnFalseIfNotFound()
        {
            var result = await _repository.DeletePlaceAsync(999);
            ClassicAssert.IsFalse(result);
        }

        [Test]
        public async Task GetAllPlacesAsync_ShouldReturnAllPlaces()
        {
            _dbContext.Places.Add(new Place
            {
                CreatedBy = "user1",
                PlaceName = "A",
                CategoryId = 1,
                City = "City",
                State = "State",
                Country = "Country",
                Address = "Address",
                PinCode = 12345,
                Description = "Desc",
                ImageUrl = "img",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            _dbContext.SaveChanges();

            var places = await _repository.GetAllPlacesAsync();
            ClassicAssert.IsNotNull(places);
            ClassicAssert.IsTrue(places.Any());
        }

        [Test]
        public async Task GetPlaceByCityAsync_ShouldReturnPlace()
        {
            var place = new Place
            {
                CreatedBy = "user1",
                PlaceName = "B",
                CategoryId = 1,
                City = "TestCity",
                State = "State",
                Country = "Country",
                Address = "Address",
                PinCode = 12345,
                Description = "Desc",
                ImageUrl = "img",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _dbContext.Places.Add(place);
            _dbContext.SaveChanges();

            var result = await _repository.GetPlaceByCityAsync("TestCity");
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual("TestCity", result.City);
        }

        [Test]
        public async Task GetPlaceByCityAsync_ShouldReturnNullIfNotFound()
        {
            var result = await _repository.GetPlaceByCityAsync("NoCity");
            ClassicAssert.IsNull(result);
        }

        [Test]
        public async Task UpdatePlaceAsync_ShouldUpdateFields()
        {
            var place = new Place
            {
                CreatedBy = "user1",
                PlaceName = "OldName",
                CategoryId = 1,
                City = "OldCity",
                State = "State",
                Country = "Country",
                Address = "Address",
                PinCode = 12345,
                Description = "Desc",
                ImageUrl = "img",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _dbContext.Places.Add(place);
            _dbContext.SaveChanges();

            var update = new UpdatePlaces
            {
                PlaceName = "NewName",
                City = "NewCity",
                IsVerified = true
            };

            var result = await _repository.UpdatePlaceAsync(place.Id, update);
            ClassicAssert.AreEqual("Place updated successfully", result);

            var updated = await _dbContext.Places.FindAsync(place.Id);
            ClassicAssert.AreEqual("NewName", updated.PlaceName);
            ClassicAssert.AreEqual("NewCity", updated.City);
            ClassicAssert.IsTrue(updated.IsVerified);
        }

        [Test]
        public async Task UpdatePlaceAsync_ShouldReturnNotFound()
        {
            var update = new UpdatePlaces { PlaceName = "X" };
            var result = await _repository.UpdatePlaceAsync(999, update);
            ClassicAssert.AreEqual("Place not found", result);
        }

        [Test]
        public async Task GetPlaceByCategoryAsync_ShouldReturnPlaces()
        {
            var place = new Place
            {
                CreatedBy = "user1",
                PlaceName = "CatPlace",
                CategoryId = 2,
                City = "City",
                State = "State",
                Country = "Country",
                Address = "Address",
                PinCode = 12345,
                Description = "Desc",
                ImageUrl = "img",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Category = _dbContext.Categories.First(c => c.Id == 2)
            };
            _dbContext.Places.Add(place);
            _dbContext.SaveChanges();

            var result = await _repository.GetPlaceByCategoryAsync("Museum");
            ClassicAssert.IsNotNull(result);
            ClassicAssert.IsTrue(result.Any(p => p.PlaceName == "CatPlace"));
        }

        [Test]
        public async Task GetPlaceByCityAndCategoryAsync_ShouldReturnPlaces()
        {
            var place = new Place
            {
                CreatedBy = "user1",
                PlaceName = "ComboPlace",
                CategoryId = 1,
                City = "ComboCity",
                State = "State",
                Country = "Country",
                Address = "Address",
                PinCode = 12345,
                Description = "Desc",
                ImageUrl = "img",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Category = _dbContext.Categories.First(c => c.Id == 1)
            };
            _dbContext.Places.Add(place);
            _dbContext.SaveChanges();

            var result = await _repository.GetPlaceByCityAndCategoryAsync("ComboCity", "Park");
            ClassicAssert.IsNotNull(result);
            ClassicAssert.IsTrue(result.Any(p => p.PlaceName == "ComboPlace"));
        }
    }
}
