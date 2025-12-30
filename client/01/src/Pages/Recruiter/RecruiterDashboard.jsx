import { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, DollarSign, Users, Check, X, Loader } from 'lucide-react'; // Added Check, X, Loader
import Navbar from '../../Components/Navbar';
import { useAuth } from '../../Context/AuthContext';

const RecruiterDashboard = () => {
  const { user } = useAuth(); 
  const [posts, setPosts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Applicants Modal State
  const [applicants, setApplicants] = useState([]);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Form State
  const [newJob, setNewJob] = useState({ 
    title: '', company: '', location: '', salary: '', 
    type: 'Full-time', description: '', requirements: '' 
  });
  const API_URL = import.meta.env.VITE_API_URL;
  // --- 1. FETCH JOBS ---
  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobs/my-jobs`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (response.ok) setPosts(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.token) fetchMyJobs();
  }, [user]);

  // --- 2. POST JOB ---
  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const formattedJob = {
        ...newJob,
        requirements: newJob.requirements.split(',').map(req => req.trim())
      };
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(formattedJob)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setPosts([data, ...posts]);
      setIsFormOpen(false);
      setNewJob({ title: '', company: '', location: '', salary: '', type: 'Full-time', description: '', requirements: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // --- 3. DELETE JOB ---
  const deletePost = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await fetch(`${API_URL}/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // --- 4. VIEW APPLICANTS ---
  const viewApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    try {
      const response = await fetch(`${API_URL}/api/applications/${jobId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      setApplicants(data);
      setIsApplicantModalOpen(true);
    } catch (err) {
      alert("Failed to load applicants");
    }
  };

  // --- 5. UPDATE STATUS (ACCEPT / REJECT) ---
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update UI locally without reloading
        setApplicants(prev => prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-500">Manage jobs and track applicants.</p>
          </div>
          <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
            <Plus size={20} /> {isFormOpen ? 'Cancel' : 'Post New Job'}
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {/* Create Job Form */}
        {isFormOpen && (
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
            <h3 className="font-bold text-lg mb-4">Create a New Post</h3>
            <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Job Title" className="p-3 border text-gray-700 rounded-lg" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              <input required placeholder="Company" className="p-3 border text-gray-700 rounded-lg" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
              <input required placeholder="Location" className="p-3 border text-gray-700 rounded-lg" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              <input required placeholder="Salary" className="p-3 border text-gray-700 rounded-lg" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
              <select className="p-3 border text-gray-700 rounded-lg bg-white" value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                <option>Full-time</option><option>Internship</option><option>Contract</option>
              </select>
              <input required placeholder="Skills (comma separated)" className="p-3 text-gray-700 border rounded-lg" value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} />
              <textarea required rows="3" placeholder="Description..." className="md:col-span-2 text-gray-700 p-3 border rounded-lg" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
              <button className="md:col-span-2 bg-blue-600 text-gray-700  py-3 rounded-lg font-bold">Publish Job</button>
            </form>
          </div>
        )}

        {/* Jobs List */}
        {loading ? <p className="text-center text-gray-500">Loading...</p> : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                  <p className="text-blue-600 text-sm font-semibold">{post.company}</p>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span><MapPin size={14} className="inline"/> {post.location}</span>
                    <span><DollarSign size={14} className="inline"/> {post.salary}</span>
                    <span><Users size={14} className="inline"/> {post.applicants || 0} Applicants</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => viewApplicants(post._id)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm">
                    View Applicants
                  </button>
                  <button onClick={() => deletePost(post._id)} className="text-red-400 p-2 hover:bg-red-50 rounded-full"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* APPLICANTS MODAL */}
      {isApplicantModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold">Applicants List</h2>
              <button onClick={() => setIsApplicantModalOpen(false)} className="text-gray-400 hover:text-gray-800 text-2xl">✕</button>
            </div>

            {applicants.length === 0 ? <p className="text-center text-gray-500">No applicants yet.</p> : (
              <div className="space-y-4">
                {applicants.map((app) => (
                  <div key={app._id} className="p-4 bg-gray-50 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="font-bold text-lg">{app.studentId.name}</p>
                      <p className="text-sm text-gray-600">{app.studentId.email}</p>
                      {app.resumeLink && (
                        <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline block mt-1">
                          View Resume ↗
                        </a>
                      )}
                      <div className="flex gap-1 mt-2">
                        {app.studentId.skills?.map((skill, i) => (
                          <span key={i} className="text-xs bg-white border px-2 py-0.5 rounded">{skill}</span>
                        ))}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-3">
                      {app.status === 'Applied' ? (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                            className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition" 
                            title="Shortlist"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                            className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200 transition" 
                            title="Reject"
                          >
                            <X size={20} />
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;