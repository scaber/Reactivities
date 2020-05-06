using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
         public class Command : IRequest
                { 
                    public string Id { get; set; }
                }
        
                public class Handler : IRequestHandler<Command>
                {
             private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context,IUserAccessor userAccessor,IPhotoAccessor photoAccessor)
                    {
                      _context = context;
                 _userAccessor = userAccessor;
                 _photoAccessor = photoAccessor;
            }
        
                    public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                    { 
                       var user= await _context.Users.SingleOrDefaultAsync(x=>x.UserName ==_userAccessor.GetCurrentUsername());
                       var photo =user.Photos.FirstOrDefault(x=>x.Id ==request.Id);

                       if (photo==null)
                       {
                           throw new RestExceptions(HttpStatusCode.NotFound, new {photo ="Not Found"});
                       }
                        if (photo.IsMain)
                       {
                           throw new RestExceptions(HttpStatusCode.NotFound, new {photo ="You cannot delete your main photo"});
                       }
                       var result =_photoAccessor.DeletePhoto(photo.Id);

                       if (result ==null)
                       {
                       throw new Exception("Problem deleting photo changes");
                           
                       }
                       user.Photos.Remove(photo);
                       
                       var success=   await _context.SaveChangesAsync() >0;
                       if (success)return Unit.Value;
                       throw new Exception("Problem deleting photo changes");
        
                    }
                }
    }
}