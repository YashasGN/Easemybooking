using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Booking_Services.Models
{
    public class Price
    {
        [Key] 
        public int PriceId { get; set; }
        public int PackageId { get; set; }
        [ForeignKey("Slots")]
        public int  SlotId { get; set; }
        public int PriceChildren {  get; set; }
        public int PriceAdults { get; set; }
        public int PriceForeign {  get; set; }
        public int PriceSenior { get; set; }
        public DateTime CreatedAt { get; set; }= DateTime.Now;
        public DateTime UpdatedAt { get; set; }=DateTime.Now;

        public virtual Slots Slots { get; set; } = null!;

    }
}
