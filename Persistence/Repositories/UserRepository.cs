using Domain.Models;
using MongoDB.Driver;
using Persistence.Context;

namespace Persistence.Repositories;
public class UserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(MongoDbContext context)
    {
        _users = context.Users;
    }

    public async Task CreateUser(User user) => 
        await _users.InsertOneAsync(user);

    public async Task<User> GetUserByUsername(string username) => 
        await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
}