namespace Package_MicroService.Models.DTO
{
    public class UpdatePackage
    {
        public string? PackageName { get; set; }
        public string? Details { get; set; }
        public string? ImageUrl { get; set; }
        public float? Rating { get; set; } 
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
