const Job = require('../models/Job');

// --- 1. POST A NEW JOB ---
const createJob = async (req, res) => {
  try {
    const { title, company, location, type, salary, description, requirements } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      recruiterId: req.user.id, // Link to the Recruiter
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// --- 2. GET ALL JOBS (For Students) ---
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 3. GET RECRUITER'S JOBS (For Dashboard) ---
const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 4. DELETE JOB (New Feature) ---
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Security Check: Does the user own this job?
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne(); // Delete from DB
    res.json({ message: 'Job removed' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// --- EXPORT EVERYTHING ---
module.exports = { 
  createJob, 
  getJobs, 
  getRecruiterJobs, 
  deleteJob 
};