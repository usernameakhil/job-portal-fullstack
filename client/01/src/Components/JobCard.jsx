import { MapPin, DollarSign, Building } from 'lucide-react';

const JobCard = ({ job, onApply }) => {
  // 1. If job is missing, don't crash, just render nothing
  if (!job) return null;

  // 2. Safe Skills Extraction (Prevents the crash)
  let skills = [];
  
  // Check 'requirements' first, then 'skills'
  const rawData = job.requirements || job.skills;

  if (Array.isArray(rawData)) {
    skills = rawData;
  } else if (typeof rawData === 'string') {
    // If it comes as a string "React, Node", split it into an array
    skills = rawData.split(',').map(s => s.trim());
  } else {
    // If nothing exists, default to empty array
    skills = [];
  }

  // 3. Defaults for missing text
  const title = job.title || "Untitled Role";
  const company = job.company || "Unknown Company";
  const type = job.type || "Full-time";
  const description = job.description || "No description provided.";
  const location = job.location || "Remote";
  const salary = job.salary || "Not Disclosed";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
            {title}
          </h3>
          <p className="text-gray-500 font-medium text-sm mt-1 flex items-center gap-1">
            <Building size={14} /> {company}
          </p>
        </div>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap">
          {type}
        </span>
      </div>

      <p className="grow text-gray-600 text-sm mb-4 line-clamp-2">
        {description}
      </p>

      {/* SAFE SKILLS LOOP */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.length > 0 ? (
          skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400 italic">No skills listed</span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pt-4 border-t border-gray-100 mt-auto">
        <span className="flex items-center gap-1">
          <MapPin size={16} className="text-gray-400"/> {location}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign size={16} className="text-gray-400"/> {salary}
        </span>
      </div>

      <button 
        onClick={onApply}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;