using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
     [ApiController]
      [Route("api/[controller]")]
        
    public class ValuesController : ControllerBase
    {
         
         private DataContext _context;
        public ValuesController(DataContext context)
        {
            this._context=context;
        }

        [HttpGet]
        public async Task<ActionResult <IEnumerable<Value>>> Get (){
            var values=await _context.Values.ToListAsync();
            return Ok(values);
        }
    }
}