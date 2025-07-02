using Booking_Services.Models;
using Microsoft.EntityFrameworkCore;

namespace Booking_Services.Data
{
    public class BookingDBContext : DbContext
    {
        internal object slot;

        public BookingDBContext(DbContextOptions<BookingDBContext> dbContextOptions): base(dbContextOptions) 
        {
        }
        public DbSet<Price> Prices { get; set; } = null!;
        public DbSet<Slots> Slots { get; set; } = null!;

    }
}
