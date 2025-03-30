import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

const UserLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState<
    { id: string; name: string; description: string }[]
  >([]);
  const [selectedStore, setSelectedStore] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [rating, setRating] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/stores", {
        withCredentials: true, // Include credentials for CORS
      });
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `/api/users/stores?search=${searchQuery}`
      );
      setStores(response.data);
    } catch (error) {
      console.error("Error searching stores:", error);
    }
  };

  const handleSubmitRating = async (storeId: string) => {
    try {
      await axios.post(`/api/users/submit-rating`, { storeId, rating });
      alert("Rating submitted successfully!");
      setRating("");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleUpdateRating = async (storeId: string) => {
    try {
      await axios.put(`/api/users/update-rating`, { storeId, rating });
      alert("Rating updated successfully!");
      setRating("");
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/signin");
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 border-r">
          <h2 className="text-xl font-semibold mb-4">User Panel</h2>
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="w-full p-2 mb-4 bg-blue-500 text-white rounded"
          >
            Search
          </button>
          <ul className="space-y-4">
            {stores.map((store) => (
              <li key={store.id}>
                <div className="p-2 border rounded mb-2">
                  <h3 className="font-semibold">{store.name}</h3>
                  <p>{store.description}</p>
                  <button
                    onClick={() => setSelectedStore(store)}
                    className="mt-2 p-2 bg-green-500 text-white rounded"
                  >
                    Rate Store
                  </button>
                </div>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left p-2 rounded hover:bg-gray-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
          {selectedStore && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-2">Rate {selectedStore.name}</h3>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Enter rating (1-5)"
                className="w-full p-2 mb-2 border rounded"
              />
              <button
                onClick={() => handleSubmitRating(selectedStore.id)}
                className="mr-2 p-2 bg-blue-500 text-white rounded"
              >
                Submit Rating
              </button>
              <button
                onClick={() => handleUpdateRating(selectedStore.id)}
                className="p-2 bg-yellow-500 text-white rounded"
              >
                Update Rating
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserLayout;
