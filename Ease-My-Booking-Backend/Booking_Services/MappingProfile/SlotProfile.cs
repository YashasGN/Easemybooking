using AutoMapper;
using Booking_Services.Models;
using Booking_Services.Models.DTO_Slots;

namespace Booking_Services.MappingProfile
{
    public class SlotProfile:Profile
    {
        public SlotProfile() {
            CreateMap<UpdateSlots, Slots>().ReverseMap();
            CreateMap<NewSlots, Slots>().ReverseMap();
        }
    }
}
