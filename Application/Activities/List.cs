using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities {
    public class List {

        public class ActivitiesEnvelope {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }

        public class Query : IRequest<ActivitiesEnvelope> {

            public Query (int? limit, int? offset, bool isGoing, bool isHost, DateTime ? startDate) {
                Limit = limit;
                Offset = offset;
                IsGoing = isGoing;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;

            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsGoing { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope> {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler (DataContext context, IMapper mapper, IUserAccessor userAccessor) {
                _userAccessor = userAccessor;
                _mapper = mapper;

                _context = context;
            }

            public async Task<ActivitiesEnvelope> Handle (Query request, CancellationToken cancellationToken) {
                //Eager loading
                // var activities = await _context.Activities
                //     .Include(x => x.UserActivities)
                //     .ThenInclude(x => x.AppUser)
                //     .ToListAsync();

                //Lazzy Loading

                var querable = _context.Activities
                    .Where (x => x.Date >= request.StartDate)
                    .AsQueryable ();

                if (request.IsGoing && !request.IsHost) {
                    querable = querable.Where (x => x.UserActivities.Any(a=>a.AppUser.UserName== _userAccessor.GetCurrentUsername()));
                }
                if (request.IsHost && !request.IsGoing)
                {
                    querable = querable.Where (x => x.UserActivities.Any(a=>a.AppUser.UserName== _userAccessor.GetCurrentUsername() && a.IsHost));
                    
                }

                var activities = await querable
                    .Skip (request.Offset ?? 0)
                    .OrderBy (x => x.Date)
                    .Take (request.Limit ?? 3).ToListAsync ();

                return new ActivitiesEnvelope {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>> (activities),
                        ActivityCount = querable.Count ()
                };

            }
        }
    }
}