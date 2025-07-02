namespace Package_MicroService.Models.DTO
{
    public class NewPackage
    {
        public string? PackageName { get; set; }
        public string? Details { get; set; }
        public string? City { get; set; }
        public int PlaceId { get; set; }
        public bool? IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ImageUrl { get; set; }
    }
}
