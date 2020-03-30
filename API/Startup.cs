using Application.Activities;
using API.Middleware;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Persistence;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace API {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            services.AddDbContext<DataContext> (x => x.UseSqlServer (Configuration.GetConnectionString ("DefaultConnection")));
            services.AddCors (opt => {
                opt.AddPolicy ("CorsPolicy", policy => {
                    policy.AllowAnyHeader ().AllowAnyMethod ().WithOrigins ("http://localhost:3000");
                });
            });
            services.AddControllers ();
            services.AddMediatR (typeof (List.Handler).Assembly);
            services.AddSwaggerGen (c => {
                c.SwaggerDoc ("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
            });
            services.AddMvc ()
                .AddFluentValidation (cfg => cfg.RegisterValidatorsFromAssemblyContaining<Create> ());
            var  builder=services.AddIdentityCore<AppUser>();
            var identityBuilder= new IdentityBuilder(builder.UserType,builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env) {

            app.UseMiddleware<ErrorHandlingMiddleware> ();

            if (env.IsDevelopment ()) {
                //app.UseDeveloperExceptionPage ();
            }
            app.UseCors ("CorsPolicy");
            app.UseHttpsRedirection ();

            app.UseRouting ();

            app.UseAuthorization ();
            app.UseSwagger ();
            app.UseSwaggerUI (c => {
                c.SwaggerEndpoint ("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = string.Empty;

            });
            
           
            app.UseEndpoints (endpoints => {
                endpoints.MapControllers ();
            });
        }
    }
}