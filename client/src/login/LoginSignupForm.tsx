import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './LoginSignupForm.css'; // Create this CSS file for notifications

declare module 'react' {
  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

const LoginSignupForm = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [registerErrors, setRegisterErrors] = useState({
    username: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStyles = () => {
      const boxicons = document.createElement('link');
      boxicons.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
      boxicons.rel = 'stylesheet';
      
      const fontAwesome = document.createElement('link');
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
      fontAwesome.rel = 'stylesheet';

      document.head.appendChild(boxicons);
      document.head.appendChild(fontAwesome);
    };

    loadStyles();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('https://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and redirect
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
      toast.success('Welcome back! Redirecting...');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Login failed. Please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterErrors({ username: '', email: '' });
  
    try {
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
        setRegisterErrors(prev => ({ ...prev, email: 'Invalid email format' }));
        toast.error('Please enter a valid email address');
        return;
      }
      const response = await fetch('https://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password
        }),
      });
  
      // First check if response is OK before parsing JSON
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle duplicate username
        if (errorData.message?.includes('username')) {
          setRegisterErrors(prev => ({ ...prev, username: 'Username is already taken' }));
          toast.error('Username is not available');
        }
        // Handle duplicate email
        else if (errorData.message?.includes('email')) {
          setRegisterErrors(prev => ({ ...prev, email: 'Email already registered' }));
          toast.error('Email is already in use');
        }
        // Handle other validation errors
        else {
          toast.error(errorData.message || 'Registration failed');
        }
        return;
      }
  
      // If response is OK, parse JSON
    
      toast.success('Registration successful! Switching to login...');
      setIsActive(false);
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // This will only catch network errors or JSON parsing errors
      toast.error('Enter Unique Email and UserName');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'custom-toast',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Username" 
              required 
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          {/* <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div> */}
          <button 
            type="submit" 
            className={`btn ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Login'}
          </button>
          <p>or login with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className='bx bxl-google'></i></a>
            <a href="#"><i className='bx bxl-facebook'></i></a>
            <a href="#"><i className='bx bxl-github'></i></a>
            <a href="#"><i className='bx bxl-linkedin'></i></a>
          </div>
        </form>
      </div>

      {/* Registration Form */}
      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Username" 
              required 
              value={registerData.username}
              onChange={(e) => {
                setRegisterData({...registerData, username: e.target.value});
                setRegisterErrors({...registerErrors, username: ''});
              }}
              className={registerErrors.username ? 'error' : ''}
            />
            <i className='bx bxs-user'></i>
            {registerErrors.username && (
              <span className="error-message">{registerErrors.username}</span>
            )}
          </div>
          <div className="input-box">
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={registerData.email}
              onChange={(e) => {
                setRegisterData({...registerData, email: e.target.value});
                setRegisterErrors({...registerErrors, email: ''});
              }}
              className={registerErrors.email ? 'error' : ''}
            />
            <i className='bx bxs-envelope'></i>
            {registerErrors.email && (
              <span className="error-message">{registerErrors.email}</span>
            )}
          </div>
          <div className="input-box">
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button 
            type="submit" 
            className={`btn ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
          <p>or register with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className='bx bxl-google'></i></a>
            <a href="#"><i className='bx bxl-facebook'></i></a>
            <a href="#"><i className='bx bxl-github'></i></a>
            <a href="#"><i className='bx bxl-linkedin'></i></a>
          </div>
        </form>
      </div>

      {/* Toggle Panel */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button 
            className="btn register-btn" 
            onClick={() => setIsActive(true)}
            disabled={isLoading}
          >
            Register
          </button>
        </div>

        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button 
            className="btn login-btn" 
            onClick={() => setIsActive(false)}
            disabled={isLoading}
          >
            Login
          </button>
        </div>
      </div>
 
      <style >{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    `}</style>

    </div>
  );
};

export default LoginSignupForm;