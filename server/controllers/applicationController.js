const Application = require('../models/Application');
const Job = require('../models/Job');

// --- 1. APPLY FOR A JOB (Student) ---
const applyForJob = async (req, res) => {
  const { jobId, recruiterId, resumeLink } = req.body;

  try {
    const alreadyApplied = await Application.findOne({ 
      jobId, 
      studentId: req.user.id 
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      jobId,
      studentId: req.user.id,
      recruiterId, // Ensure this field exists in your Application Schema!
      resumeLink: resumeLink || '', 
      status: 'Applied'
    });
    
    // Increment applicant count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Application failed: ' + error.message });
  }
};

// --- 2. GET APPLICANTS FOR A JOB (Recruiter - Specific Job) ---
const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email skills')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 3. GET MY APPLICATIONS (Student) ---
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate('jobId', 'title company location status')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 4. GET ALL APPLICATIONS FOR RECRUITER (Recruiter Dashboard) ---
// (This was the missing function causing the crash!)
const getRecruiterApplications = async (req, res) => {
  try {
    // Find all applications where the recruiterId matches the logged-in user
    const applications = await Application.find({ recruiterId: req.user.id })
      .populate('studentId', 'name email') // Get student name
      .populate('jobId', 'title')          // Get job title
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching recruiter apps:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 5. UPDATE STATUS (Recruiter - Accept/Reject) ---
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body; 

  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- EXPORT ALL FUNCTIONS ---
module.exports = { 
  applyForJob, 
  getJobApplications, 
  getStudentApplications, 
  updateApplicationStatus,
  getRecruiterApplications, // Now this actually exists!
};