namespace Booking_Services.Models
{
    public class Slots
    {
        public int SlotsId { get; set; }
        public int PackageId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly TimeFrom { get; set; }
        public TimeOnly TimeTo { get; set; }
        public int MaxTicket { get; set; }
        public int TicketBooked { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

    }
}
