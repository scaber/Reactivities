using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController:BaseController
    {
        [HttpGet("{userName}")]
        public async Task<ActionResult<Profile>> Get (string userName)
        {
            return await Mediator.Send(new Details.Query{UserName =userName});
        }

    }
}