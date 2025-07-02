namespace Account_MicroService.Model.DTO
{
    public class LoginResponseDTO
    {
        public string? UserId { get; set; }
        public string? Token { get; set; }
        public List<string> Role
        {
            get; set;
        }
    }
}
