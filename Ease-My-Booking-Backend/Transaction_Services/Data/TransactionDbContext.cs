using Microsoft.EntityFrameworkCore;
using Transaction_Services.Models;

namespace Transaction_Services.Data
{
    public class TransactionDbContext: DbContext
    {
        public TransactionDbContext(DbContextOptions<TransactionDbContext> options) : base(options) { }
        // Define DbSets for your entities here, e.g.:
        public DbSet<Transaction> Transactions { get; set; }
    }
    
}
