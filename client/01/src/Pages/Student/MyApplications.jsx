import { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import { Building, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const MyApplications = () => {
  const { user } = useAuth(); // 1. Get User Token
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH REAL APPLICATIONS FROM DB ---
  useEffect(() => {
    const fetchMyApps = async () => {
      if (!user?.token) return;

      try {
        const response = await fetch('http://localhost:5001/api/applications/my-applications', {
          headers: {
            'Authorization': `Bearer ${user.token}` // Send Token to prove identity
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setApplications(data);
        }
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApps();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-500 mb-8">Track the status of your job applications.</p>
        
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading your applications...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-dashed text-center text-gray-500 shadow-sm">
            <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-lg font-medium">No applications found.</p>
            <p className="text-sm">Head over to the Dashboard to find and apply for jobs!</p>
          </div>
        ) : (
          /* --- THE NEW CARD LAYOUT YOU REQUESTED --- */
          <div className="grid md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                
                {/* JOB DETAILS */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {app.jobId?.title || 'Job Unavailable'}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                    <Building size={16} className="text-gray-400" /> 
                    {app.jobId?.company || 'Unknown Company'}
                  </p>
                  <p className="text-gray-400 text-xs mt-2 flex items-center gap-2">
                    <Calendar size={14} /> 
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {/* STATUS BADGE */}
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide inline-block ${
                    app.status === 'Shortlisted' ? 'bg-green-100 text-green-700 border border-green-200' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-blue-50 text-blue-700 border border-blue-100'
                  }`}>
                    {app.status}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;