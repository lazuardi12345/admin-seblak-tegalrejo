import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Memeriksa token di localStorage

  if (!isAuthenticated) {
    // Jika tidak ada token, arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  // Jika ada token, tampilkan halaman yang dilindungi
  return children; 
};

export default ProtectedRoute;
