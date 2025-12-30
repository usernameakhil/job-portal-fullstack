import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GoogleButton from '../../Components/GoogleButton';
import { useAuth } from '../../Context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Store error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- UPDATED: REAL BACKEND LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // 1. Send data to Backend
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 2. Check for errors (e.g., Wrong password)
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // 3. SUCCESS: Update Context
      console.log('Login Successful:', data);
      login(data); // 'data' contains { token, name, email, role, _id }

      // 4. Navigate based on the REAL role from Database
      if (data.role === 'recruiter') {
        navigate('/RecruiterDashboard');
      } else {
        navigate('/StudentDashboard');
      }

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message); // Show error to user
    }
  };

  // --- GOOGLE LOGIN (Keep as mock for now) ---
  const handleGoogleLogin = () => {
    const storedRole = 'student'; // Default for Google mock
    login({
      role: storedRole,
      email: "google-user@example.com",
      name: "Google User"
    });
    navigate('/StudentDashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Enter your credentials to access your account.</p>

        {/* ERROR MESSAGE DISPLAY */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Enter your email" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="••••••••" 
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition shadow-md">
            Sign In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
        </div>

        <GoogleButton 
          text="Sign in with Google" 
          onClick={handleGoogleLogin} 
        />

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;