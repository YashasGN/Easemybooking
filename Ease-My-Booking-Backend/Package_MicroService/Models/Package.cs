using Package_MicroService.Models;
using System.ComponentModel.DataAnnotations;

public class Package
{
    [Key]
    public int Id { get; set; }

        public int PlaceId {  get; set; }
        public string? PackageName { get; set; }
        public string? Details { get; set; }
        public bool IsActive { get; set; } = true;      
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public string? ImageUrl { get; set; }
        public float Rating { get; set; } = 8;


}

