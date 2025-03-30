import { useState } from "react";

import api from "../../utils/axios";
import axios from "axios";

const AddStore = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await api.post("/admin/add-store", {
        name,
        email,
        address,
      });
      setSuccessMessage(response.data.data);
      console.log(response.data);
      setName("");
      setEmail("");
      setAddress("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.status === 401) {
          setErrorMessage("Please sign in again, your session has expired");
        } else {
          setErrorMessage(error.response?.data?.message || "Failed to add store");
        }
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Store</h2>
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

        {['name', 'email', 'address'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              Store {field}
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={field === 'name' ? name : field === 'email' ? email : address}
              onChange={(e) => {
                if (field === 'name') setName(e.target.value);
                if (field === 'email') setEmail(e.target.value);
                if (field === 'address') setAddress(e.target.value);
              }}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full mt-4 bg-black text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
        >
          Add Store
        </button>
      </form>
    </div>
  );
};

export default AddStore;
