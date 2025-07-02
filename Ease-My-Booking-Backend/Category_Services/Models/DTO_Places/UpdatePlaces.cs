namespace Places_Services.Models.DTO_Places
{
    public class UpdatePlaces
    {
        public string? PlaceName { get; set; }
        public int? CategoryId { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? Address { get; set; }
        public int? PinCode { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsRejected { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public string? VerifiedBy { get; set; }


    }
}
