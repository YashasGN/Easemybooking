using System.ComponentModel.DataAnnotations;

namespace Booking_Services.Models.DTO_Price
{
    public class NewPrice
    {
        [Required]
        public int PackageId { get; set; }
        [Required]
        public int SlotId { get; set; }
        [Required]
        public int PriceChildren { get; set; }
        [Required]
        public int PriceAdults { get; set; }
        [Required]
        public int PriceForeign { get; set; }
        [Required]
        public int PriceSenior { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
