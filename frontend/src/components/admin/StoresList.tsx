import { useState, useEffect, useCallback } from "react";
import api from "../../utils/axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: number;
}

const StoresList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState("");

  const fetchStores = useCallback(async () => {
    try {
      setError("");
      const response = await api.get(
        `/admin/stores?name=${search}&address=${address}`,
        {
          withCredentials: true,
        }
      );
      console.log("Fetched stores:", response.data.data);
      setStores(response.data.data);
    } catch (error) {
      setError("Failed to fetch stores");
      console.error("Error fetching stores:", error);
    }
  }, [search, address]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStores();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, address, fetchStores]);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Stores Management</h2>

        <div className="flex gap-4">
          <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
            />
          </div>
          <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store, index) => (
          <div
            key={store.id}
            className={`${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } overflow-hidden shadow-lg rounded-lg divide-y divide-gray-200 border-2 border-gray-200 hover:border-primary-500 transition-colors duration-200`}
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                {store.name}
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  #{store.id}
                </span>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{store.email}</p>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {store.address}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Average Rating
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {store.averageRating ? (
                      <span className="flex items-center">
                        {store.averageRating.toFixed(1)}
                        <span className="ml-1 text-yellow-400">★</span>
                      </span>
                    ) : (
                      "No ratings yet"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoresList;
