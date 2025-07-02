using AutoMapper;
using Transaction_Services.Models;
using Transaction_Services.Models.DTO;

namespace Transaction_Services.MappingProfile
{
    public class TransactionMapping:Profile
    {

        public TransactionMapping()
        {
            
             CreateMap<NewTransaction, Transaction>().ReverseMap();
        }
    }
}
