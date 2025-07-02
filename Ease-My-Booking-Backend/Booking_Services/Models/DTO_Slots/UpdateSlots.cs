namespace Booking_Services.Models.DTO_Slots
{
    public class UpdateSlots
    {
        public DateOnly Date {  get; set; }
        public TimeOnly TimeFrom { get; set; }
        public TimeOnly TimeTo { get; set; }
        public int MaxTicket { get; set; }
    }
}
