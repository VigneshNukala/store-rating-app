import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Store {
  id: number;
  name: string;
  address: string;
  email: string;
}

const StoreList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const navigate = useNavigate(); // Hook to navigate to other routes

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/user/stores?name=${nameSearch}&address=${addressSearch}`,
          {
            withCredentials: true,
          }
        );
        setStores(response.data.data);
      } catch (err) {
        setError("Failed to fetch stores");
        console.error("Error fetching stores:", err);
      }
    };

    // Add debouncing to prevent too many API calls
    const timeoutId = setTimeout(() => {
      fetchStores();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [nameSearch, addressSearch]);

  // Function to handle navigation to the SubmitRating page
  const handleSelectStore = (id: number) => {
    navigate(`/user/submit-rating/${id}`); // Navigate to the SubmitRating page with the store ID
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Stores List</h2>

        <div className="mt-4 sm:mt-0 flex gap-4">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
            />
          </div>

          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by address..."
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store.id}
            className="relative bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {store.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{store.address}</p>
            <p className="mt-1 text-sm text-gray-500">{store.email}</p>
            <button
              onClick={() => handleSelectStore(store.id)} // Navigate to SubmitRating on click
              className="mt-4 w-full rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Rate Store
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
