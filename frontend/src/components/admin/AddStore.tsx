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
      setSuccessMessage(response.data.message);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="text-3xl font-bold mb-6">Add a New Store</h2>
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
          <label className="block text-sm font-semibold mb-2" htmlFor="name">
            Store Name
          </label>
          <input
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            id="name"
            placeholder="Enter store name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Store Email
          </label>
          <input
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            id="email"
            placeholder="Enter store email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" htmlFor="address">
            Store Address
          </label>
          <input
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            id="address"
            placeholder="Enter store address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-blue-500 text-white p-3 w-full rounded hover:bg-blue-600 transition duration-300"
          type="submit"
        >
          Add Store
        </button>
      </form>
    </div>
  );
};

export default AddStore;
