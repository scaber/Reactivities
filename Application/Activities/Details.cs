using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities {
    public class Details {
        public class Query : IRequest<ActivityDto> {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, ActivityDto> {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler (DataContext context, IMapper mapper) {
                     _mapper = mapper;
                    _context = context;
            }

            public async Task<ActivityDto> Handle (Query request, CancellationToken cancellationToken) {
                //Eagle loading 
                // var activity = await _context.Activities
                //     .Include (x => x.UserActivities)
                //     .ThenInclude (x => x.AppUser)
                //     .SingleOrDefaultAsync (x => x.Id == request.Id);

                    //lazzy loading
                 var activity = await _context.Activities
                    .FindAsync (request.Id);

                    

                if (activity == null) {
                    throw new RestExceptions (HttpStatusCode.NotFound, new { activity = "Not Found" });
                }
                var activityToReturn = _mapper.Map<Activity,ActivityDto>(activity);

                return   activityToReturn;
            }
        }
    }
}