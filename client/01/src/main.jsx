import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Layouts
import LandingLayout from './Layouts/LandingLayout.jsx'
import AppLayout from './Layouts/AppLayout.jsx'

// Pages
import LandingPage from './Pages/LandingPage.jsx'
import Register from './Pages/Authentification/Register.jsx' 
import Login from './Pages/Authentification/Login.jsx'
import StudentDashboard from './Pages/Student/StudentDashboard.jsx'
import RecruiterDashboard from './Pages/Recruiter/RecruiterDashboard.jsx'
import EditProfile from './Pages/Student/EditProfile.jsx'
import MyApplications from './Pages/Student/MyApplications.jsx'
import FindJobs from './Pages/Student/FindJobs.jsx'
import { AuthProvider } from './Context/AuthContext';
import JobApplications from './Pages/Recruiter/JobApplications.jsx'
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  
  {
    path: "/register",
    element: <Register />, 
  },
  {
    path:"/login",
    element:<Login/>
  },

  {
    path: "/app",
    element: <AppLayout />,
  },
  {
  path: "/StudentDashboard", // Let's call it dashboard specifically
  element: <StudentDashboard />,
  },
  { path: "/RecruiterDashboard", element: <RecruiterDashboard />

   }, 
   { path: "/EditProfile", element: <EditProfile /> },
   { path: "/MyApplications", element: <MyApplications /> },
   { path: "/FindJobs", element: <FindJobs /> },
   { path: "/job-applications", element: <JobApplications /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)