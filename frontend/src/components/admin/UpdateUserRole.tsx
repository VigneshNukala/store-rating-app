import { useState } from "react";
import axios from "axios";

const UpdateUserRole = () => {
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3001/admin/update-role",
        { email, newRole },
        { withCredentials: true }
      );
      setSuccessMessage(response.data.result || "Role updated successfully.");
      setEmail("");
      setNewRole("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.error || "Failed to update role.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="text-3xl font-bold mb-6">Update User Role</h2>
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        {successMessage && (
          <div className="mb-4 text-green-500 text-sm font-semibold">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm font-semibold">
            {errorMessage}
          </div>
        )}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            User Email
          </label>
          <input
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            id="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" htmlFor="newRole">
            New Role
          </label>
          <select
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="newRole"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="Admin">Admin</option>
            <option value="Normal User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
          </select>
        </div>
        <button
          className="bg-blue-500 text-white p-3 w-full rounded hover:bg-blue-600 transition duration-300"
          type="submit"
        >
          Update Role
        </button>
      </form>
    </div>
  );
};

export default UpdateUserRole;
