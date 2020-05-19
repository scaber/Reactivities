using System.Collections.Generic;
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

         [HttpPut]
        public async Task<ActionResult<Unit>> Edit (Edit.Command command)
        {
            return await Mediator.Send(command);
        }


          [HttpGet("{userName}/activities")]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities (string userName,string predicate)
        {
            return await Mediator.Send(new ListActivities.Query{Username=userName,Predicate=predicate});
        }



    }
}