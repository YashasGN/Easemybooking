namespace Account_MicroService.Model.DTO
{
    public class NewUserDTO
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? City { get; set; }
        public string? Region { get; set; }
       
    }
}
