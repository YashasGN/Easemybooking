using AutoMapper;
using Places_Services.Models;
using Places_Services.Models.DTO_Places;

namespace Places_Services.MappingProfile
{
    public class PlacesProfile:Profile
    {
        public PlacesProfile() {
            CreateMap<UpdatePlaces, Place>().ReverseMap();
            CreateMap<NewPlaces, Place>().ReverseMap();
        }
    }
}
