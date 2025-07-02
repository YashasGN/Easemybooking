using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Transaction_Services.Data;
using Transaction_Services.Models;
using Transaction_Services.Models.DTO;

namespace Transaction_Services.Repository
{
    public class TransactionRepository : ITransactionRepository
    {

        private readonly TransactionDbContext _transactionDbContext;
        private readonly IMapper _mapper;
        public TransactionRepository(TransactionDbContext transactionDbContext, IMapper mapper)
        {
            _transactionDbContext = transactionDbContext;
            _mapper = mapper;
        }
        public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync()
        {
            try
            {
                var transactions=await _transactionDbContext.Transactions.ToListAsync();
                return transactions;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving transactions: {ex.Message}");
            }
        }

        public async Task<(int, Transaction)> GetTransactionByIdAsync(int id)
        {
            try
            {
                var transaction = await _transactionDbContext.Transactions.FirstOrDefaultAsync(e => e.Id == id);
                if (transaction == null)
                {
                    return (0, null);
                }
                return (1, transaction);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving transaction by ID: {ex.Message}");
            }
        }

        public async Task<(int, string)> CreateTransactionAsync(NewTransaction transaction)
        {
            try
            {
                var newTransaction = _mapper.Map<Transaction>(transaction);
                await _transactionDbContext.Transactions.AddAsync(newTransaction);
                await _transactionDbContext.SaveChangesAsync();
                return (1, "Transaction created successfully");
            }
            catch (Exception ex)
            {
                return (0, $"Error creating transaction: {ex.Message}");
            }
        }
        public async Task<List<Transaction>> GetTransactionByUserId(string userId)
        {
            try
            {
                var transactions = await _transactionDbContext.Transactions.Where(e => e.UserId == userId).ToListAsync();
                return transactions;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving transactions by user ID: {ex.Message}");
            }
        }


    }
}
