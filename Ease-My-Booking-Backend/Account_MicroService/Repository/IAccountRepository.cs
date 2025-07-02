using Account_MicroService.Model.DTO;

namespace Account_MicroService.Repository
{
    public interface IAccountRepository
    {
       Task<(int,string)> RegisterAsync(NewUserDTO newUser,string role);
        Task<LoginResponseDTO?> LoginAsync(LoginDTO login);

        Task<string> UpdateRoleAsync(string email, string role);

    }
}
