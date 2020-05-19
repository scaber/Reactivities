using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity,ActivityDto>();
            CreateMap<UserActivity,AttendeeDto>()
            .ForMember(d => d.UserName, o=>o.MapFrom(s=>s.AppUser.UserName))
            .ForMember(d=>d.Display, o=> o.MapFrom(s=>s.AppUser.Display))
            .ForMember(d=>d.Image, o=> o.MapFrom(s=>s.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url))
            .ForMember(d=>d.Following, o=>o.MapFrom<FollowingResolver>());

        }
    }
}