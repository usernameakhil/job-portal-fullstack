const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes'); 
const userRoutes = require('./routes/userRoutes');              
const applicationRoutes = require('./routes/applicationRoutes');
// 1. Load Environment Variables
dotenv.config();

// 2. Connect to Database
connectDB();

// 3. Initialize App (CREATE 'app' HERE FIRST)
const app = express();
const PORT = process.env.PORT || 5001;

// 4. Middleware (NOW you can use 'app')
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse incoming JSON data

// 5. Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);        
app.use('/api/applications', applicationRoutes);
// 6. Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});