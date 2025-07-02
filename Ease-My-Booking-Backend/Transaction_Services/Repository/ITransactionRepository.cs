using Transaction_Services.Models;
using Transaction_Services.Models.DTO;

namespace Transaction_Services.Repository
{
    public interface ITransactionRepository
    {

        Task<IEnumerable<Transaction>> GetAllTransactionsAsync();
        Task<(int, Transaction)> GetTransactionByIdAsync(int id);
        Task<(int, string)> CreateTransactionAsync(NewTransaction transaction);
        Task<List<Transaction>>GetTransactionByUserId(string userId);

    }
}
