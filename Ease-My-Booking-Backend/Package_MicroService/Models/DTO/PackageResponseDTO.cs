namespace Package_MicroService.Models.DTO
{
    public class PackageResponseDTO
    {
        public int Id { get; set; }
        public string? PackageName { get; set; }
        public string? Details { get; set; }
        public string? City { get; set; }
        public string? CategoryName { get; set; }
        public string? PlaceName { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
