using Microsoft.EntityFrameworkCore;
using Places_Services.Models;

namespace Places_Services.Data
{
    public class PlacesDBContext:DbContext
    {
        public PlacesDBContext(DbContextOptions<PlacesDBContext> dbContextOptions) : base(dbContextOptions)
        {
        }
        public DbSet<Place> Places{ get; set; }=null!;
        public DbSet<Category> Categories { get; set; } = null!;
    }
}
