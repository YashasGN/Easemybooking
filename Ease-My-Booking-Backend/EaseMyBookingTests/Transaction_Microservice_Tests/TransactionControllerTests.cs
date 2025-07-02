using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using Transaction_Services.Controllers;
using Transaction_Services.Models.DTO;
using Transaction_Services.Repository;
using Transaction_Services.Models;
using NUnit.Framework.Legacy;


namespace EaseMyBooking_Tests.Transaction_Microservice_Tests
{
    [TestFixture]
    public class TransactionControllerTests
    {
        private Mock<ITransactionRepository> _mockRepo;
        private TransactionController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<ITransactionRepository>();
            _controller = new TransactionController(_mockRepo.Object);
        }

        [Test]
        public async Task GetAllTransactions_ReturnsOkWithTransactions()
        {
            var transactions = new List<Transaction> { new Transaction { Id = 1 } };
            _mockRepo.Setup(r => r.GetAllTransactionsAsync()).ReturnsAsync(transactions);

            var result = await _controller.GetAllTransactions();

            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            ClassicAssert.AreEqual(transactions, okResult.Value);
        }

        [Test]
        public async Task GetAllTransactions_RepositoryThrows_Returns500()
        {
            _mockRepo.Setup(r => r.GetAllTransactionsAsync()).ThrowsAsync(new Exception("fail"));

            var result = await _controller.GetAllTransactions();

            ClassicAssert.IsInstanceOf<ObjectResult>(result);
            var objResult = result as ObjectResult;
            ClassicAssert.AreEqual(500, objResult.StatusCode);
        }

        [Test]
        public async Task GetTransactionById_Found_ReturnsOk()
        {
            var transaction = new Transaction { Id = 2 };
            _mockRepo.Setup(r => r.GetTransactionByIdAsync(2)).ReturnsAsync((1, transaction));

            var result = await _controller.GetTransactionById(2);

            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            ClassicAssert.AreEqual(transaction, okResult.Value);
        }

        [Test]
        public async Task GetTransactionById_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetTransactionByIdAsync(3)).ReturnsAsync((0, null as Transaction));

            var result = await _controller.GetTransactionById(3);

            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task AddTransaction_Valid_ReturnsOk()
        {
            var newTransaction = new NewTransaction { TransactionId = "T1" };
            _mockRepo.Setup(r => r.CreateTransactionAsync(newTransaction)).ReturnsAsync((1, "Success"));

            var result = await _controller.AddTransaction(newTransaction);

            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            ClassicAssert.AreEqual("Success", okResult.Value);
        }

        [Test]
        public async Task AddTransaction_Invalid_ReturnsBadRequest()
        {
            var result = await _controller.AddTransaction(null);
            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task AddTransaction_RepositoryReturnsError_ReturnsBadRequest()
        {
            var newTransaction = new NewTransaction { TransactionId = "T2" };
            _mockRepo.Setup(r => r.CreateTransactionAsync(newTransaction)).ReturnsAsync((0, "Error"));

            var result = await _controller.AddTransaction(newTransaction);

            ClassicAssert.IsInstanceOf<BadRequestObjectResult>(result);
            var badResult = result as BadRequestObjectResult;
            ClassicAssert.AreEqual("Error", badResult.Value);
        }

        [Test]
        public async Task GetTransactionByUserId_Found_ReturnsOk()
        {
            var transactions = new List<Transaction> { new Transaction { Id = 5 } };
            _mockRepo.Setup(r => r.GetTransactionByUserId("user1")).ReturnsAsync(transactions);

            var result = await _controller.GetTransactionByUserId("user1");

            ClassicAssert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            ClassicAssert.AreEqual(transactions, okResult.Value);
        }

        [Test]
        public async Task GetTransactionByUserId_NotFound_ReturnsNotFound()
        {
            _mockRepo.Setup(r => r.GetTransactionByUserId("user2")).ReturnsAsync(new List<Transaction>());

            var result = await _controller.GetTransactionByUserId("user2");

            ClassicAssert.IsInstanceOf<NotFoundObjectResult>(result);
        }
    }
}
