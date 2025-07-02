using System.ComponentModel.DataAnnotations;

namespace Places_Services.Models.DTO_Places
{
    public class NewPlaces
    {
        [Required]
        public string CreatedBy { get; set; }
        [Required]
        public string PlaceName { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string State { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public int PinCode { get; set; }
        public string Description { get; set; }

        public string ImageUrl { get; set; }    
        public DateTime CreatedAt { get; set; } = DateTime.Now;


    }
}
