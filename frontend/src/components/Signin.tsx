import api from "../utils/axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setRole } = useRole();
  const { login } = useAuth();

  const handleSignIn = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post(
        "/auth/signin",
        credentials,
        { withCredentials: true }
      );

      console.log("Signin successful:", response.data);

      // Make sure we're getting the correct token from response
      const token = response.data.token || response.data.data.token;
      const role = response.data.data.role;

      // Store token with Bearer prefix if not already included
      const tokenWithBearer = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      login(tokenWithBearer, role);
      setRole(role);

      // Get saved path or default to role-based route
      const savedPath = localStorage.getItem("intendedPath");
      if (savedPath) {
        localStorage.removeItem("intendedPath");
        navigate(savedPath);
      } else {
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "user") {
          navigate("/user");
        } else if (role === "owner") {
          navigate("/owner"); // Changed from /owner to /store-owner
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error during signin:", error);
        setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    handleSignIn({ email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
      <form
        className="bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>
        )}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-black text-white p-3 w-full rounded hover:bg-gray-800 transition duration-300 flex items-center justify-center"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default Signin;
