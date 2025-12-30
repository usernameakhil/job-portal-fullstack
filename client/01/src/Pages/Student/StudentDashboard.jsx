import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import { Search, MapPin, DollarSign, Briefcase, Building, User, CheckCircle, Link as LinkIcon, X } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const StudentDashboard = () => {
  const { user, updateUserName } = useAuth(); 
  
  // Data States
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set()); 
  const [loading, setLoading] = useState(true);
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Profile Modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', skills: '' });

  // Apply Modal (Resume)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); 
  const [resumeLink, setResumeLink] = useState('');

  // --- 1. FETCH JOBS (Public - Runs always) ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("Fetching jobs...");
        const response = await fetch('http://localhost:5001/api/jobs');
        const data = await response.json();
        
        if (response.ok) {
          setJobs(data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []); // Empty dependency array = runs once on load

  // --- 2. FETCH APPLICATIONS (Private - Runs when User loads) ---
  // --- 2. FETCH APPLICATIONS (Private - Runs when User loads) ---
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.token) return;

      try {
        const response = await fetch('http://localhost:5001/api/applications/my-applications', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          // --- CRITICAL FIX: Filter out Broken Applications first ---
          // This removes any application where the Job was deleted
          const validApps = data.filter(app => app.jobId && app.jobId._id);

          console.log(`Loaded ${validApps.length} valid applications (Filtered out ${data.length - validApps.length} broken ones)`);

          // Now it is safe to map because we know jobId exists
          const appliedSet = new Set(validApps.map(app => app.jobId._id));
          
          setAppliedJobs(appliedSet);
          setMyApplications(validApps); 
        }

        // Pre-fill profile data if user exists
        if (user) {
          setProfileData({
            name: user.name || '',
            skills: user.skills ? user.skills.join(', ') : ''
          });
        }

      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [user]);
  // --- 3. OPEN APPLY MODAL ---
  const openApplyModal = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    setResumeLink(''); 
  };

  // --- 4. SUBMIT APPLICATION ---
  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (!selectedJob) return;

    if (!user || !user.token) {
      alert("Please login again.");
      return;
    }

    try {
      console.log("Applying to:", selectedJob.title, "Recruiter:", selectedJob.recruiterId);

      const response = await fetch('http://localhost:5001/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          jobId: selectedJob._id, 
          recruiterId: selectedJob.recruiterId,
          resumeLink: resumeLink 
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Application failed');
      }

      // Success: Update UI
      setAppliedJobs(prev => new Set(prev).add(selectedJob._id));
      
      // Add the new application to the "My Applications" list immediately
      // (This is optional but makes it appear without refresh)
      // For now, we rely on refresh or re-fetch logic, but closing modal is key.
      setIsApplyModalOpen(false);
      alert("Application Sent Successfully! 🚀");
      
      // Reload applications to update the list at the top
      window.location.reload(); 

    } catch (error) {
      alert(error.message);
    }
  };

  // --- 5. UPDATE PROFILE ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const skillsArray = profileData.skills.split(',').map(s => s.trim());
      
      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name: profileData.name, skills: skillsArray })
      });

      const data = await response.json(); 

      if (!response.ok) throw new Error('Update failed');

      updateUserName(data); 

      alert("Profile Updated!");
      setIsProfileOpen(false);
      
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO */}
      <div className="bg-blue-600 text-white py-12 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name || 'Student'} 👋</h1>
          <p className="text-blue-100 mb-8">Find the perfect job that matches your skills.</p>
          
          <div className="bg-white p-2 rounded-lg shadow-lg flex items-center max-w-2xl mx-auto">
            <Search className="text-gray-400 ml-3" />
            <input 
              type="text" 
              placeholder="Search roles or companies..." 
              className="w-full p-3 text-gray-800 outline-none rounded-r-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={() => setIsProfileOpen(true)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <User size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* --- MY APPLICATIONS SECTION (New!) --- */}


      {/* JOBS LIST */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Opportunities</h2>

        {loading ? <p className="text-center text-gray-500">Loading jobs...</p> : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.length === 0 && <p className="col-span-2 text-center text-gray-500">No jobs found.</p>}
            
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-500 font-medium flex items-center gap-1 mt-1"><Building size={16} /> {job.company}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{job.type}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                <div className="flex gap-4 text-sm text-gray-500 mb-6 border-t pt-4">
                  <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={16}/> {job.salary}</span>
                </div>

                {appliedJobs.has(job._id) ? (
                  <button disabled className="w-full bg-green-100 text-green-700 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                    <CheckCircle size={18} /> Applied
                  </button>
                ) : (
                  <button 
                    onClick={() => openApplyModal(job)} // OPEN MODAL HERE
                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
                  >
                    Apply Now <Briefcase size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- RESUME APPLICATION MODAL --- */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Apply to {selectedJob?.company}</h2>
              <button onClick={() => setIsApplyModalOpen(false)}><X className="text-gray-500" /></button>
            </div>
            
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Resume Link / Portfolio</label>
                <div className="relative mt-1">
                  <LinkIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    required 
                    placeholder="https://drive.google.com/..." 
                    className="w-full text-gray-800 pl-10 p-2 border rounded-lg"
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Paste a link to your Google Drive, LinkedIn, or GitHub.</p>
              </div>

              <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE MODAL --- */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input className="w-full p-2 border text-gray-700 rounded-lg mt-1" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Skills</label>
                <textarea className="w-full p-2 border text-gray-700 rounded-lg mt-1" rows="3" value={profileData.skills} onChange={(e) => setProfileData({...profileData, skills: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsProfileOpen(false)} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;