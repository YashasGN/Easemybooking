using Microsoft.EntityFrameworkCore;
using Package_MicroService.Models;

namespace Package_MicroService.Data
{
    public class PackageDbContext:DbContext
    {
        public PackageDbContext(DbContextOptions<PackageDbContext> options) : base(options) { }
        public DbSet<Package> Package {  get; set; }
    }
}
