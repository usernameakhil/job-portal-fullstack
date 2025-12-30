const express = require('express');
const router = express.Router();
const { createJob, getJobs, getRecruiterJobs, deleteJob } = require('../controllers/jobController'); // <--- Import deleteJob
const { protect } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/', protect, createJob);
router.get('/my-jobs', protect, getRecruiterJobs);

// --- ADD THIS LINE ---
router.delete('/:id', protect, deleteJob); 

module.exports = router;