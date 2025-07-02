using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Account_MicroService.Model;

namespace Account_MicroService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [Authorize(Roles = UserRoles.User)]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            // This method would typically interact with a service or repository to retrieve users.
            // For now, we return a placeholder response.
            return Ok("Get All users From DB");
        }
        [HttpGet("getbyid/:{id}")]

        public async Task<IActionResult> GetUserById(int id)
        {
            return Ok("Sucess");
        }

    }
}
