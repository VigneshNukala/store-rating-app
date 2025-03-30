import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Send a request to the backend to clear the cookie
      await axios.post(
        "http://localhost:3001/auth/logout", // Replace with your logout endpoint
        {},
        { withCredentials: true }
      );

      // Clear any additional client-side storage (e.g., localStorage)
      localStorage.removeItem("authToken");

      // Redirect to the login page
      navigate("/signin");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Store Rating App</div>

      <button
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
