using System.ComponentModel.DataAnnotations;

namespace Booking_Services.Models.DTO_Slots
{
    public class NewSlots
    {
        [Required]
        public int PackageId { get; set; }
        [Required]
        public DateOnly Date { get; set; }
        [Required]
        public TimeOnly TimeFrom { get; set; }
        [Required]
        public TimeOnly TimeTo { get; set; }
        [Required]
        public int MaxTicket { get; set; }
       
        public DateTime CreatedAt { get; set; }= DateTime.Now;
       
        

    }
}

