import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import GoogleButton from '../../Components/GoogleButton';
import { useAuth } from '../../Context/AuthContext';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); // To show error messages

  // Auto-select role if coming from Landing Page
  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- UPDATED SUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. CALL THE API (Connect to Backend)
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // 2. SUCCESS: Log the user in via Context
      login(data); // 'data' contains the Token and User Info from database

      // 3. NAVIGATE
      if (role === 'student') {
        navigate('/StudentDashboard');
      } else {
        navigate('/RecruiterDashboard');
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // --- GOOGLE SIGNUP (Keep Mock for now, or update later) ---
  const handleGoogleSignup = () => {
    login({
      role: role,
      email: "google-user@example.com",
      name: "Google User"
    });

    if (role === 'student') {
      navigate('/StudentDashboard'); 
    } else {
      navigate('/RecruiterDashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* ERROR MESSAGE DISPLAY */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        {/* Role Toggles */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6">
          <button type="button" className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`} onClick={() => setRole('student')}>Student</button>
          <button type="button" className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${role === 'recruiter' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`} onClick={() => setRole('recruiter')}>Recruiter</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-4 py-2 border rounded-lg text-gray-900" required placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-2 border rounded-lg text-gray-900" required placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" value={formData.password} onChange={handleChange} type="password" className="w-full px-4 py-2 border rounded-lg text-gray-900" required placeholder="••••••••" />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition shadow-md mt-2">
            Sign Up as {role === 'student' ? 'Student' : 'Recruiter'}
          </button>
        </form>

        {/* Divider & Google Button */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign up with</span></div>
        </div>

        <GoogleButton 
          text={`Continue as ${role === 'student' ? 'Student' : 'Recruiter'}`} 
          onClick={handleGoogleSignup} 
        />

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;