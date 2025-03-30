import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { LockClosedIcon } from "@heroicons/react/24/outline";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/owner/update-password",
        {
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        setMessage("Password updated successfully");
        setError("");
        // Clear form
        setFormData({
          email: "",
          currentPassword: "",
          newPassword: "",
        });
        navigate("/signin");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white py-8 px-6 shadow-sm rounded-lg ring-1 ring-gray-900/5">
        <div className="mb-6 flex items-center">
          <LockClosedIcon className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Change Password
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {(
            ["email", "currentPassword", "newPassword"] as Array<
              keyof typeof formData
            >
          ).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type={field.includes("Password") ? "password" : "email"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
