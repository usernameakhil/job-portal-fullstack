import { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- CHECK LOGIN ON LOAD ---
  useEffect(() => {
    // Check if we have a saved user string
    const storedUserString = localStorage.getItem('user');
    
    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        setUser(storedUser); // This restores token, name, role, etc.
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem('user'); // Clean up bad data
      }
    }
    setLoading(false);
  }, []);

  // --- LOGIN FUNCTION ---
  const login = (userData) => {
    // userData contains { _id, name, email, role, token }
    console.log("Saving User to Context:", userData); // Debugging
    
    setUser(userData);
    
    // Save the WHOLE object to LocalStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear everything
    
    // Optional: Redirect to login page
    window.location.href = '/login';
  };

  // --- UPDATE USER NAME/DATA ---
  const updateUserName = (updatedData) => {
    setUser((prevUser) => {
      // Merge the old user data (like token) with the new data (like name/skills)
      const newUser = { ...prevUser, ...updatedData };
      
      // Update LocalStorage so it stays fixed even if you refresh
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserName, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};