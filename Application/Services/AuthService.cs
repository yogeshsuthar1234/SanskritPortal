using Domain.Models;
using Persistence.Repositories;

namespace Application.Services;
public class AuthService
{
    private readonly UserRepository _userRepo;

    public AuthService(UserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<User> Register(User user)
    {
        // Assuming some other hashing or storage mechanism is used
        await _userRepo.CreateUser(user);
        return user;
    }

    public async Task<User> Login(string username, string password)
    {
        var user = await _userRepo.GetUserByUsername(username);
        // Assuming password verification is handled differently
        if (user != null && user.Password == password)
        {
            return user;
        }
        else
        {
            throw new Exception("Invalid credentials");
        }
    }
}