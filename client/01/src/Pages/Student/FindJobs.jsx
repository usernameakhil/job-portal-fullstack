import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, X, Loader, Building } from 'lucide-react'; 
import Navbar from '../../Components/Navbar';
import JobCard from '../../Components/JobCard';
import { useAuth } from '../../Context/AuthContext';

const FindJobs = () => {
  const { user } = useAuth(); 
  
  // --- STATE ---
  const [jobs, setJobs] = useState([]); 
  const [filteredJobs, setFilteredJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeLink, setResumeLink] = useState(""); 
const API_URL = import.meta.env.VITE_API_URL;
  // --- 1. FETCH JOBS ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobs`);
        const data = await response.json();
        
        if (response.ok) {
          setJobs(data);
          setFilteredJobs(data); 
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // --- 2. FILTER LOGIC ---
  useEffect(() => {
    let result = jobs;

    // Search by Title or Company
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(job => 
        (job.title?.toLowerCase() || "").includes(lowerTerm) || 
        (job.company?.toLowerCase() || "").includes(lowerTerm)
      );
    }

    // Filter by Role
    if (filterRole !== "All") {
      result = result.filter(job => 
        (job.title?.toLowerCase() || "").includes(filterRole.toLowerCase()) || 
        job.type === filterRole
      );
    }

    // Filter by Location
    if (filterLocation !== "All") {
      result = result.filter(job => 
        (job.location?.toLowerCase() || "").includes(filterLocation.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [searchTerm, filterRole, filterLocation, jobs]);

  // --- 3. HANDLE APPLY ---
  const handleApply = (job) => {
    if (!user) {
      alert("Please login to apply!");
      return;
    }
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // --- 4. SUBMIT APPLICATION ---
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!resumeLink) return alert("Please enter a resume link!");

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
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
        const err = await response.json();
        throw new Error(err.message || "Failed to apply");
      }

      alert(`Application Submitted Successfully! 🚀`);
      setIsModalOpen(false);
      setResumeLink("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-blue-600 from-blue-600 to-blue-800 p-8 rounded-2xl shadow-lg mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
          <p className="text-blue-100 mb-6">Browse thousands of job openings from top companies.</p>
          
          <div className="bg-white p-2 rounded-xl shadow-md flex flex-col md:flex-row gap-2 max-w-4xl">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Job title, keywords, or company..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-blue-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg font-bold transition">
              Search
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT: FILTERS (Sticky Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Filter size={20} className="text-blue-600" />
                <h3 className="font-bold text-gray-800">Filters</h3>
                { (searchTerm || filterRole !== 'All' || filterLocation !== 'All') && (
                  <button 
                    onClick={() => {setSearchTerm(""); setFilterRole("All"); setFilterLocation("All")}}
                    className="ml-auto text-xs text-red-500 font-medium hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Role Filter */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase size={16} /> Job Role
                </label>
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition"
                >
                  <option value="All">All Roles</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Product Manager</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Intern">Internship</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Location
                </label>
                <select 
                  value={filterLocation} 
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition"
                >
                  <option value="All">All Locations</option>
                  <option value="Remote">Remote</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT: JOB RESULTS */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> active jobs
              </p>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500">Finding best opportunities for you...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map(job => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    onApply={() => handleApply(job)} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <Briefcase className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-lg font-medium">No jobs found matching your filters.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setFilterRole("All"); setFilterLocation("All");}}
                  className="mt-2 text-blue-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- APPLICATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Apply for Job</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Building size={12} /> {selectedJob?.company}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700">Resume / Portfolio Link</label>
                <input 
                  required
                  type="url" 
                  placeholder="https://drive.google.com/file/d/..."
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  className="w-full p-3 border rounded-xl mt-1 text-gray-800 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please provide a valid Google Drive, LinkedIn, or GitHub link.
                </p>
              </div>

              <div className="pt-2">
                <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                  Submit Application 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FindJobs;
