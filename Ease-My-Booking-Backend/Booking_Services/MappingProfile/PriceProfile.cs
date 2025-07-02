using AutoMapper;
using Booking_Services.Models;
using Booking_Services.Models.DTO_Price;

namespace Booking_Services.MappingProfile
{
    public class PriceProfile:Profile
    {
        public PriceProfile() { 
            CreateMap<UpdatePrice,Price> ().ReverseMap();
            CreateMap<NewPrice,Price> ().ReverseMap();
        }

    }
}
