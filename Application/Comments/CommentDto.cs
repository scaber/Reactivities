using System;

namespace Application.Comments
{
    public class CommentDto
    {
        
        public Guid Id { get; set; }
        public string Body { get; set; } 
        public DateTime CreateAt { get; set; }
        public string Username { get; set; }
        public string Display { get; set; }
        public string Image { get; set; }
    }
}