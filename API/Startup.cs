using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Application.Activities;
using Application.Interfaces;
using Application.Profiles;
using API.Middleware;
using API.SignalR;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.

        public void ConfigureDevelopmentServices (IServiceCollection services) {
            services.AddDbContext<DataContext> (opt => {
                opt.UseLazyLoadingProxies ();
                opt.UseSqlServer (Configuration.GetConnectionString ("DefaultConnection"));
            });

            ConfigureServices(services);
        }
         public void ConfigureProductionServices (IServiceCollection services) {
            services.AddDbContext<DataContext> (opt => {
                opt.UseLazyLoadingProxies ();
                opt.UseSqlServer (Configuration.GetConnectionString ("DefaultConnection"));
            });

            ConfigureServices(services);
        }
        public void ConfigureServices (IServiceCollection services) {

            services.AddCors (opt => {
                opt.AddPolicy ("CorsPolicy", policy => {
                    policy.AllowAnyHeader ().AllowAnyMethod ().WithOrigins ("http://localhost:3000").AllowCredentials ();
                });
            });
            services.AddControllers ().AddNewtonsoftJson ();
            services.AddMediatR (typeof (List.Handler).Assembly);
            services.AddAutoMapper (typeof (List.Handler));
            services.AddSignalR ();
            services.AddMvc (opt => {
                    var policy = new AuthorizationPolicyBuilder ().RequireAuthenticatedUser ().Build ();
                    opt.Filters.Add (new AuthorizeFilter (policy));
                })
                .AddFluentValidation (cfg => cfg.RegisterValidatorsFromAssemblyContaining<Create> ());

            var builder = services.AddIdentityCore<AppUser> ();
            var identityBuilder = new IdentityBuilder (builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext> ();
            identityBuilder.AddSignInManager<SignInManager<AppUser>> ();

            services.AddIdentity<IdentityUser, IdentityRole> ()
                .AddEntityFrameworkStores<DataContext> ();

            services.AddAuthorization (opt => {
                opt.AddPolicy ("IsActivityHost", policy => {
                    policy.Requirements.Add (new IsHostRequirement ());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler> ();

            var key = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (Configuration["TokenKey"]));

            services.AddAuthentication (x => {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer (x => {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                    x.Events = new JwtBearerEvents {
                        OnMessageReceived = context => {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty (accessToken) && (path.StartsWithSegments ("/chat"))) {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });
            services.AddSwaggerGen (c => {
                c.SwaggerDoc ("v1",
                    new OpenApiInfo {
                        Title = "Reactivities API",
                            Version = "v1",
                            Description = "A simple example ASP.NET Core Web API",
                            TermsOfService = new Uri ("https://example.com/terms"),
                            Contact = new OpenApiContact {
                                Name = "Tayfun Kılıç",
                                    Email = string.Empty,
                                    Url = new Uri ("https://www.linkedin.com/in/tayfunkilic/"),
                            },
                    });
                c.AddSecurityDefinition ("Bearer", new OpenApiSecurityScheme {
                    Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer"
                });

                c.AddSecurityRequirement (new OpenApiSecurityRequirement () {
                    {
                        new OpenApiSecurityScheme {
                            Reference = new OpenApiReference {
                                    Type = ReferenceType.SecurityScheme,
                                        Id = "Bearer"
                                },

                                Name = "Bearer",
                                In = ParameterLocation.Header,

                        },
                        new List<string> ()
                    }
                });

                c.CustomSchemaIds (t => t.ToString ());
            });
            services.AddScoped<IJWTGenerator, JWTGenerator> ();
            services.AddScoped<IUserAccessor, UserAccsessor> ();

            services.AddScoped<IProfileReader, ProfileReader> ();
            services.AddScoped<IPhotoAccessor, PhotoAccessor> ();
            services.Configure<CloudinarySettings> (Configuration.GetSection ("Cloudinary"));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env) {

            if (env.IsDevelopment ()) {
                app.UseDeveloperExceptionPage ();
            }

            app.UseHttpsRedirection ();
            app.UseSwagger ();
            app.UseSwaggerUI (c => {
                c.SwaggerEndpoint ("/swagger/v1/swagger.json", "V1");
                c.RoutePrefix = "/api";
            });
            app.UseRouting ();
            app.UseMiddleware (typeof (ErrorHandlingMiddleware));

            //NWebsec.AspNetCore.Middleware
            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt=> opt.NoReferrer());
            app.UseXXssProtection(opt=> opt.EnabledWithBlockMode());
            app.UseXfo(opt=>opt.Deny());

            app.UseCsp(opt=>opt
                    .BlockAllMixedContent()
                    .StyleSources(s=>s.Self().CustomSources("https://fonts.googleapis.com","sha256-F4GpCPyRepgP5znjMD8sc7PEjzet5Eef4r09dEGPpTs="))
                    .FontSources(s=>s.Self().CustomSources("https://fonts.gstatic.com","data:"))
                    .FormActions(s=>s.Self())
                    .FrameAncestors(s=>s.Self())
                    .ImageSources(s=>s.Self().CustomSources("https://res.cloudinary.com","blob:","data:"))
                    .ScriptSources(s=>s.Self().CustomSources("sha256-ma5XxS1EBgt17N22Qq31rOxxRWRfzUTQS1KOtfYwuNo="))


            );



            app.UseDefaultFiles ();
            app.UseStaticFiles ();
            app.UseAuthentication ();
            app.UseCors ("CorsPolicy");
            app.UseAuthorization ();

            app.UseEndpoints (endpoints => {
                endpoints.MapControllers ();
                endpoints.MapControllerRoute (
                    name: "spa-fallback",
                    pattern: "{controller=Fallback}/{action=Index}"

                );

                endpoints.MapFallbackToController ("Index", "Fallback");

            });

            app.UseSignalR (routes => { routes.MapHub<ChatHub> ("/chat"); });

        }
    }
}