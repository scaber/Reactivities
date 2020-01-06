using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class WeatherForecastController : ControllerBase 
    {
         private readonly DataContext _context;

        public WeatherForecastController (DataContext context) {
            this._context = context;
        }

        [HttpGet]
        public async Task<ActionResult <IEnumerable<Value>>> Get (){
            var values=await _context.Values.ToListAsync();
            return Ok(values);
        }
        private static readonly string[] Summaries = new [] {
            "Freezing",
            "Bracing",
            "Chilly",
            "Cool",
            "Mild",
            "Warm",
            "Balmy",
            "Hot",
            "Sweltering",
            "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController (ILogger<WeatherForecastController> logger) {
            _logger = logger;
        }

        // [HttpGet]
        // public IEnumerable<WeatherForecast> Get () {
        //     var rng = new Random ();
        //     return Enumerable.Range (1, 5).Select (index => new WeatherForecast {
        //             Date = DateTime.Now.AddDays (index),
        //                 TemperatureC = rng.Next (-20, 55),
        //                 Summary = Summaries[rng.Next (Summaries.Length)]
        //         })
        //         .ToArray ();
        // }
    }
}