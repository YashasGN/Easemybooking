using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Transaction_Services.Models.DTO;
using Transaction_Services.Repository;

namespace Transaction_Services.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionController(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        [HttpGet("getall")]
        public async Task<ActionResult> GetAllTransactions()
        {
            try
            {
                var transactions = await _transactionRepository.GetAllTransactionsAsync();
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("getbyid/{id}")]
        public async Task<ActionResult> GetTransactionById(int id)
        {
            try
            {
                var (status, transaction) = await _transactionRepository.GetTransactionByIdAsync(id);
                if (status == 0 || transaction == null)
                {
                    return NotFound("Transaction not found");
                }
                return Ok(transaction);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("add")]
        public async Task<ActionResult> AddTransaction(NewTransaction newTransaction)
        {
            try
            {
                if (newTransaction == null)
                {
                    return BadRequest("Invalid transaction data.");
                }
                var (status, message) = await _transactionRepository.CreateTransactionAsync(newTransaction);
                if (status == 1)
                {
                    return Ok(message);
                }
                else
                {
                    return BadRequest(message);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("getbyuserid/{userId}")]
        public async Task<ActionResult> GetTransactionByUserId(string userId)
        {
            try
            {
                var transactions = await _transactionRepository.GetTransactionByUserId(userId);
                if (transactions == null || transactions.Count == 0)
                {
                    return NotFound("No transactions found for this user.");
                }
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }
    }
}
