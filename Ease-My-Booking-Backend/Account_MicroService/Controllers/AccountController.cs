using Account_MicroService.Model.DTO;
using Account_MicroService.Model;
using Account_MicroService.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Account_MicroService.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository accountRepository;

        public AccountController(IAccountRepository accountRepository)
        {
            this.accountRepository = accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(NewUserDTO user)
        {
            await accountRepository.RegisterAsync(user, UserRoles.User);
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO login)
        {
            var response = await accountRepository.LoginAsync(login);
            if (response.UserId == "0")
            {
                return Unauthorized(new { message = response.Token });
            }
            return Ok(new { UserId = response.UserId, Token = response.Token, Role = response.Role });
        }
        [HttpPost("updateRole")]
        public async Task<IActionResult> UpdateRole(string email, string role)
        {
            var result = await accountRepository.UpdateRoleAsync(email, role);

            if (result == "User not found")
                return NotFound(new { message = result });

            // 🟢 Instead of returning 409, return 200 OK
            return Ok(new { message = result });
        }
    }
    }
