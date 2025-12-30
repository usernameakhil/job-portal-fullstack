import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; 

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        
        {/* LOGO REDIRECTS BASED ON ROLE */}
        <Link to={user?.role === 'recruiter' ? "/RecruiterDashboard" : "/StudentDashboard"} className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <span className="font-bold text-xl text-blue-600">CareerLaunch</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            
            {/* --- STUDENT LINKS --- */}
            {user.role === 'student' && (
              <>
                <Link to="/FindJobs" className="text-gray-600 hover:text-blue-600 font-medium">Find Jobs</Link>
                <Link to="/MyApplications" className="text-gray-600 hover:text-blue-600 font-medium">My Applications</Link>
              </>
            )}

            {/* --- RECRUITER LINKS --- */}
            {user.role === 'recruiter' && (
              <>
                <Link to="/RecruiterDashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                  My Posts
                </Link>
                <Link to="/job-applications" className="text-gray-600 hover:text-blue-600 font-medium">
                  View Applications
                </Link>
              </>
            )}

            {/* USER PROFILE */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  {getInitials(user.name)}
                </div>
                <span className="text-sm font-medium hidden md:block">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
             <Link to="/login" className="text-blue-600 font-medium">Login</Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;