using Account_MicroService.Data;
using Account_MicroService.Model;
using Account_MicroService.Model.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Account_MicroService.Repository
{

    public class AccountRepository : IAccountRepository
    {
        private readonly AccountDBContext accountDBContext;
            
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AccountRepository(AccountDBContext accountDBContext, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.accountDBContext = accountDBContext?? throw new ArgumentNullException(nameof(accountDBContext));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _roleManager = roleManager ?? throw new ArgumentNullException(nameof(roleManager));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<LoginResponseDTO>LoginAsync(LoginDTO login)
        {
            var validateUser = await _userManager.FindByNameAsync(login.UserName);
            if (validateUser == null)
            {
                return new LoginResponseDTO()
                {
                    UserId = "0",
                    Token = "Invalid Email "
                };

            }
            else
            {
                if(!await _userManager.CheckPasswordAsync(validateUser, login.Password!))
                {
                    return new LoginResponseDTO()
                    {
                        UserId = "0",
                        Token = "Invalid Password"
                    };

                }
                else
                {
                    var userRoles = await _userManager.GetRolesAsync(validateUser);
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, validateUser.Id),
                        new Claim(ClaimTypes.Email, validateUser.Email!)
                    };
                    foreach (var role in userRoles)
                    {
                        claims.Add(new Claim(ClaimTypes.Role, role));
                    }

                    return new LoginResponseDTO()
                    {
                        UserId = validateUser.Id,
                        Token = GenerateToken(claims),
                        Role = userRoles.ToList() // ✅ Include the role here

                    };

                }

            }
           
        }

        // Register a new user
        public async Task<(int, string)> RegisterAsync(NewUserDTO user, string role)
        {
            // add a user into usermanager
            //  add a role if not exist
            // add a user to user table and add the role to user
            ApplicationUser applicationUser = new ApplicationUser()
            {
                Name = user.UserName,
                UserName = user.UserName,
                Email = user.Email,


            };
            User newuser = new User()
            {
                UserName = user.UserName,
                Email = user.Email,
                DateOfBirth = user.DateOfBirth,
                City = user.City,
                Region = user.Region
            };
            var userExist = await _userManager.FindByEmailAsync(user.Email!);
            var roleExist = await _roleManager.RoleExistsAsync(role);
            if (userExist == null)
            {


                if (!roleExist)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
                await _userManager.CreateAsync(applicationUser, user.Password);
                await _userManager.AddToRoleAsync(applicationUser, role);
                // save changes to the database
                await accountDBContext.Users.AddAsync(newuser); ;
                await accountDBContext.SaveChangesAsync();

                return (1, "user Created Succesfully");

            }
            else
            {
                return (0, "User Already Exist");
            }


        }

        // Update user role
        public async Task<string> UpdateRoleAsync(string email, string role)
        {
            var userExist = await _userManager.FindByEmailAsync(email);
            if (userExist == null)
            {
                return "User not found";
            }

            var roleExist = await _roleManager.RoleExistsAsync(role);
            if (!roleExist)
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            // ✅ Only add role if the user doesn't already have it
            if (!await _userManager.IsInRoleAsync(userExist, role))
            {
                await _userManager.AddToRoleAsync(userExist, role);
                return "Role updated successfully";
            }

            return "User already has the role";
        }


        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:secret"])); // Replace with your secret key
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _configuration["JWT:validIssuer"],
                Audience = _configuration["JWT:validAudience"],
                Expires = DateTime.UtcNow.AddHours(1), // Token expiration times
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(claims)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


    }
}
