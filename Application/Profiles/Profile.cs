using System.Collections.Generic;
using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string Display { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public ICollection<Photo> Photos  { get; set; }
    }
}