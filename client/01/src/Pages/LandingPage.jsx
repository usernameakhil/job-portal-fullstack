import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
        CareerLaunch <span className="text-gray-800">AI</span> 🚀
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        The AI-powered bridge between Talent and Recruiters.
      </p>
      
      <div className="flex gap-4">
        {/* BUTTON 1: Student Register */}
        <Link 
          to="/register" 
          state={{ role: 'student' }} 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          I am a Student
        </Link>

        {/* BUTTON 2: Recruiter Register */}
        <Link 
          to="/register" 
          state={{ role: 'recruiter' }} 
          className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
        >
          I am a Recruiter
        </Link>
      </div>

      <div className="mt-8">
        <p className="text-gray-500">Already have an account?</p>
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Login here
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;