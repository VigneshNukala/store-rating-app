import { useState } from "react";
import api from "../../utils/axios";
import axios from "axios";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    address: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await api.post("/admin/user", formData);
      setSuccessMessage(response.data.message || "User created successfully");
      console.log(response.data);
      setFormData({ name: "", email: "", password: "", role: "", address: "" });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.status === 401) {
          setErrorMessage("Please sign in again, your session has expired");
        } else {
          setErrorMessage(
            error.response?.data?.message || "Error creating user"
          );
        }
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Add New User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {(Object.keys(formData) as (keyof typeof formData)[]).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field}
            </label>
            {field === "role" ? (
              <select
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="owner">Store Owner</option>
              </select>
            ) : (
              <input
                type={field === "password" ? "password" : "text"}
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                required
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full mt-4 bg-black text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
