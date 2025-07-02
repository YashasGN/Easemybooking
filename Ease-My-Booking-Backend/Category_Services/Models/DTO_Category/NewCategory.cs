using System.ComponentModel.DataAnnotations;

namespace Places_Services.Models.DTO_Category
{
    public class NewCategory
    {
        [Required]
        public string CategoryName { get; set; }
        [Required]
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
