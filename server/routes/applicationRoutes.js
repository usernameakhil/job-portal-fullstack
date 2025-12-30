const express = require('express');
const router = express.Router();
const { 
  applyForJob, 
  getJobApplications, 
  getStudentApplications, 
  updateApplicationStatus,
  getRecruiterApplications // <--- 1. IMPORT THIS
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// --- 1. SPECIFIC ROUTES (Must come FIRST) ---

// Student: Apply for a job
router.post('/', protect, applyForJob);

// Student: Get my history
router.get('/my-applications', protect, getStudentApplications);

// Recruiter: Get all received applications
// 🚨 CRITICAL: This must be BEFORE '/:jobId'
router.get('/recruiter-applications', protect, getRecruiterApplications); 

// --- 2. DYNAMIC ROUTES (Must come LAST) ---

// Recruiter: Update Status (Accept/Reject)
router.put('/:id/status', protect, updateApplicationStatus); 

// Recruiter: Get applications for one specific job
// (If you put this at the top, it breaks everything else!)
router.get('/:jobId', protect, getJobApplications);

module.exports = router;