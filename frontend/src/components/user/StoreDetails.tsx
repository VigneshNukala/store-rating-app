import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StoreDetails = () => {
  const { id } = useParams();
  interface Store {
    name: string;
    address: string;
  }

  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/stores/${id}`
        );
        setStore(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch store details");
      }
    };
    fetchStoreDetails();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Store Details</h1>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {store && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Store Name</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{store.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 text-lg text-gray-900">{store.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetails;
