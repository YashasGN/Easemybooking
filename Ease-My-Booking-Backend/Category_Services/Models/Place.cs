using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Places_Services.Models
{
    public class Place
    {
        [Key]
        public int Id { get; set; }
        public string CreatedBy { get; set; }
        public string PlaceName { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; } 
        public string Address { get; set; }
        public int PinCode { get; set; }
        public string Description { get; set; }
        public bool IsVerified { get; set; }
        public string? VerifiedBy { get; set; }
        public bool IsActive { get; set; }
        public bool IsRejected { get; set; }
        public string ImageUrl { get; set; }
        public float Rating { get; set; } = 7;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public virtual Category Category { get; set; } = null!;

    }
}
