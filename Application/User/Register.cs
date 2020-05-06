using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User {
    public class Register {
        public class Command : IRequest<User> {
            public string Display { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command> {
            public CommandValidator () {
                RuleFor (x => x.Display).NotEmpty ();
                RuleFor (x => x.UserName).NotEmpty ();
                RuleFor (x => x.Email).NotEmpty ().EmailAddress();
                RuleFor (x => x.Password).Password();
            }
        }
        public class Handler : IRequestHandler<Command,User> {
            private readonly DataContext _context;
            private readonly IJWTGenerator _jwtGenerator;
            private readonly UserManager<AppUser> _userManager;

            public Handler (DataContext context, UserManager<AppUser> userManager, IJWTGenerator jwtGenerator) {
                _userManager = userManager;
                _context = context;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle (Command request, CancellationToken cancellationToken) {
                if (await _context.Users.Where (x => x.Email == request.Email).AnyAsync ())
                    throw new RestExceptions (HttpStatusCode.BadRequest, new { Email = "Email already exist" });
                if (await _context.Users.Where (x => x.UserName == request.UserName).AnyAsync ())
                    throw new RestExceptions (HttpStatusCode.BadRequest, new { UserName = "UserName already exist" });
              
              var user =new AppUser
              {
                  Display=request.UserName,
                  Email=request.Email,
                  UserName=request.UserName
              };

                var result = await _userManager.CreateAsync(user,request.Password);
                if (result.Succeeded) {
                   
                   return new User
                   {
                       Display=user.Display,
                       Token=_jwtGenerator.CreateToken(user),
                       Username=user.UserName,
                        Image = user.Photos.FirstOrDefault(x=>x.IsMain)?.Url
                   };

                }
                throw new Exception ("Problem saving changes");
            }
        }
    }
}