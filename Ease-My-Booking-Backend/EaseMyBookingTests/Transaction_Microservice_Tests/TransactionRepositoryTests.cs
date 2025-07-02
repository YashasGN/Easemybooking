using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using NUnit.Framework.Legacy;
using Transaction_Services.Data;
using Transaction_Services.Models;
using Transaction_Services.Models.DTO;
using Transaction_Services.Repository;

namespace EaseMyBooking_Tests.Transaction_Microservice_Tests
{
    [TestFixture]
    public class TransactionRepositoryTests
    {
        private TransactionDbContext _dbContext;
        private IMapper _mapper;
        private TransactionRepository _repository;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<TransactionDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new TransactionDbContext(options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<NewTransaction, Transaction>();
            });
            _mapper = config.CreateMapper();

            _repository = new TransactionRepository(_dbContext, _mapper);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreateTransactionAsync_ShouldCreateTransaction()
        {
            var newTransaction = new NewTransaction
            {
                TransactionId = "T1",
                PackageId = 1,
                UserId = "user1",
                UserName = "Test User",
                ModeOfPayment = "Cash",
                TransactionStatus = "Success",
                TicketForChildren = 1,
                TicketForAdults = 2,
                TicketForSeniorCitizen = 0,
                TicketForForeigner = 0,
                TotalTicketsPrice = 100,
                SloteDate = DateOnly.FromDateTime(DateTime.Today),
                SloteTime = "10:00",
                TransactionTime = DateTime.Now
            };

            var (status, message) = await _repository.CreateTransactionAsync(newTransaction);

            ClassicAssert.AreEqual(1, status);
            ClassicAssert.AreEqual("Transaction created successfully", message);
            ClassicAssert.AreEqual(1, _dbContext.Transactions.Count());
        }

        [Test]
        public async Task GetAllTransactionsAsync_ShouldReturnAllTransactions()
        {
            _dbContext.Transactions.AddRange(
                new Transaction
                {
                    UserId = "user1",
                    TransactionId = "T1",
                    UserName = "User One",
                    ModeOfPayment = "Cash",
                    TransactionStatus = "Success",
                    SloteTime = "10:00"
                },
                new Transaction
                {
                    UserId = "user2",
                    TransactionId = "T2",
                    UserName = "User Two",
                    ModeOfPayment = "Card",
                    TransactionStatus = "Pending",
                    SloteTime = "11:00"
                }
            );
            await _dbContext.SaveChangesAsync();

            var result = await _repository.GetAllTransactionsAsync();

            ClassicAssert.AreEqual(2, result.Count());
        }

        [Test]
        public async Task GetTransactionByIdAsync_WithExistingId_ShouldReturnTransaction()
        {
            var transaction = new Transaction
            {
                UserId = "user1",
                TransactionId = "T1",
                UserName = "User One",
                ModeOfPayment = "Cash",
                TransactionStatus = "Success",
                SloteTime = "10:00"
            };
            _dbContext.Transactions.Add(transaction);
            await _dbContext.SaveChangesAsync();

            var id = transaction.Id; // EF generated Id after save

            var (status, result) = await _repository.GetTransactionByIdAsync(id);

            ClassicAssert.AreEqual(1, status);
            ClassicAssert.IsNotNull(result);
            ClassicAssert.AreEqual(id, result.Id);
        }

        [Test]
        public async Task GetTransactionByIdAsync_WithNonExistingId_ShouldReturnNull()
        {
            var (status, result) = await _repository.GetTransactionByIdAsync(999);

            ClassicAssert.AreEqual(0, status);
            ClassicAssert.IsNull(result);
        }

        [Test]
        public async Task GetTransactionByUserId_WithExistingUserId_ShouldReturnCorrectTransactions()
        {
            _dbContext.Transactions.AddRange(
                new Transaction
                {
                    UserId = "user1",
                    TransactionId = "T1",
                    UserName = "User One",
                    ModeOfPayment = "Cash",
                    TransactionStatus = "Success",
                    SloteTime = "10:00"
                },
                new Transaction
                {
                    UserId = "user1",
                    TransactionId = "T2",
                    UserName = "User One",
                    ModeOfPayment = "Card",
                    TransactionStatus = "Success",
                    SloteTime = "11:00"
                },
                new Transaction
                {
                    UserId = "user2",
                    TransactionId = "T3",
                    UserName = "User Two",
                    ModeOfPayment = "Cash",
                    TransactionStatus = "Pending",
                    SloteTime = "12:00"
                }
            );
            await _dbContext.SaveChangesAsync();

            var result = await _repository.GetTransactionByUserId("user1");

            ClassicAssert.AreEqual(2, result.Count);
            ClassicAssert.IsTrue(result.All(t => t.UserId == "user1"));
        }
    }
}
