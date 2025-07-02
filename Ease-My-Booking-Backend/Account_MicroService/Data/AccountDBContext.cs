using Account_MicroService.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;



namespace Account_MicroService.Data
{
    public class AccountDBContext: IdentityDbContext<ApplicationUser>
    {
        public AccountDBContext(DbContextOptions<AccountDBContext> options) : base(options)
        {
        }
       public DbSet<User> Users { get; set; }
        }

    }
