using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Account_MicroService.Model
{
    public class ApplicationUser:IdentityUser
    {
        [MaxLength(20)]
        public string? Name { get; set; }
    }
}
