using AutoMapper;
using Places_Services.Models;
using Places_Services.Models.DTO_Category;

namespace Places_Services.MappingProfile
{
    public class CategoryProfile:Profile
    {
        public CategoryProfile()
        {
            CreateMap<UpdateCategory, Category>().ReverseMap();
            CreateMap<NewCategory, Category>().ReverseMap();
        }
    }
}
