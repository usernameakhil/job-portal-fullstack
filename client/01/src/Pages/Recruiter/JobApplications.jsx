import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, XCircle, Loader, User, Calendar } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import { useAuth } from '../../Context/AuthContext';

const JobApplications = () => {
  const { user } = useAuth(); // Get Recruiter Token
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
const API_URL = import.meta.env.VITE_API_URL;
  // --- 1. FETCH APPLICATIONS FROM DB ---
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.token) return;

      try {
        // Fetch applications ONLY for jobs posted by this Recruiter
        const response = await fetch(`${API_URL}/api/applications/recruiter-applications`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setApplications(data);
        } else {
          console.error("Failed to fetch applications:", data.message);
        }
      } catch (error) {
        console.error("Error connecting to server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  // --- 2. UPDATE STATUS (Accept/Reject) ---
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update UI instantly without refreshing
        setApplications(prev => prev.map(app => 
          app._id === appId ? { ...app, status: newStatus } : app
        ));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Server error");
    }
  };

  // Helper to generate a consistent "Mock" AI score based on ID (since DB might not have it yet)
  // You can remove this once your backend calculates real scores.
  const getScore = (id) => {
    const num = id.charCodeAt(id.length - 1) + id.charCodeAt(id.length - 2);
    return (num % 40) + 60; // Returns a number between 60 and 99
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Received Applications</h1>
        <p className="text-gray-500 mb-8">Manage students who have applied to your jobs.</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed">
            <p className="text-gray-500">No applications received yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600">Student Name</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Job Role</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Resume Link</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">AI Score</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => {
                    const score = app.aiScore || getScore(app._id); // Use real score or mock
                    
                    return (
                      <tr key={app._id} className="hover:bg-gray-50 transition">
                        {/* Student Name */}
                        <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {app.studentId?.name ? app.studentId.name.charAt(0) : <User size={14} />}
                          </div>
                          {app.studentId?.name || "Unknown Student"}
                        </td>

                        {/* Job Role */}
                        <td className="p-4 text-gray-600">
                          {app.jobId?.title || <span className="text-red-400 italic">Job Deleted</span>}
                        </td>

                        {/* Resume Link */}
                        <td className="p-4">
                          <a 
                            href={app.resumeLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                          >
                            <ExternalLink size={16} /> View Resume
                          </a>
                        </td>

                        {/* AI Match Score */}
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            score >= 85 ? 'bg-green-100 text-green-700 border-green-200' : 
                            score >= 70 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                            'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {score}% Match
                          </span>
                        </td>

                        {/* Date */}
                        <td className="p-4 text-gray-500 text-sm whitespace-nowrap">
                           {new Date(app.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          {app.status === 'Applied' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition border border-green-200" 
                                title="Shortlist"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(app._id, 'Rejected')}
                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition border border-red-200" 
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {app.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;