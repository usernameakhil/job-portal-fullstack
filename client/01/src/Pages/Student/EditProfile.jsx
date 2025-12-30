import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext'; // <--- Ensure this path is correct

// Options matching Dashboard MOCK_JOBS
const AVAILABLE_ROLES = [
  "Frontend Developer",
  "Backend Developer", 
  "Full Stack Developer", 
  "UI/UX Designer",
  "Data Scientist"
];

const EditProfile = () => {
  const navigate = useNavigate();
  
  // 1. GET THE CONTEXT FUNCTION
  const { updateUserName } = useAuth(); 
  
  const [name, setName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Load existing data
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('studentProfile'));
    if (savedData) {
      setName(savedData.name || "");
      setSelectedRoles(savedData.roles || []);
    }
  }, []);

  // Handle Checkboxes
  const handleCheckboxChange = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const profileData = {
      name: name,
      roles: selectedRoles
    };

    // 2. SAVE TO LOCAL STORAGE (For persistence)
    localStorage.setItem('studentProfile', JSON.stringify(profileData));

    // 3. UPDATE CONTEXT (This updates the Navbar immediately!)
    updateUserName(name); 

    // 4. NAVIGATE
    navigate('/StudentDashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
          <h1 className="text-xl font-bold">Edit Preferences</h1>
          <button onClick={() => navigate('/StudentDashboard')} className="hover:bg-blue-500 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* NAME INPUT */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* ROLES CHECKBOXES */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              What roles are you looking for?
              <span className="text-gray-400 font-normal ml-2 text-xs">(Select multiple)</span>
            </label>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <label 
                    key={role} 
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(role)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {role}
                      </span>
                    </div>
                    {isSelected && <CheckCircle size={18} className="text-blue-600" />}
                  </label>
                );
              })}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition flex justify-center items-center gap-2">
            <Save size={20} /> Save & Find Jobs
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;