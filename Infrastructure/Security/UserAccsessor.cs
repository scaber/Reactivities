using System.Linq;
using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccsessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserAccsessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentUsername()
        {
            var userName=_httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault(x=>x.Type == ClaimTypes.NameIdentifier)?.Value;

            return userName;
        }
    }
}