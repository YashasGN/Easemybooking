using AutoMapper;
using Package_MicroService.Models;
using Package_MicroService.Models.DTO;

namespace Package_MicroService.MappingProfile
{
    public class PackageMapping:Profile
    {
        public PackageMapping() {
            CreateMap<UpdatePackage, Package>().ReverseMap();
            CreateMap<NewPackage, Package>().ReverseMap();
        }
    }
}
