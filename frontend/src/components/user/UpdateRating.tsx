import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Store {
  id: number;
  name: string;
  address: string;
  email: string;
}

const UpdateRating = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentRating, setCurrentRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeResponse, ratingResponse] = await Promise.all([
          axios.get(`http://localhost:3001/user/stores/${id}`, {
            withCredentials: true,
          }),
          axios.get(`http://localhost:3001/user/rating/${id}`, {
            withCredentials: true,
          }),
        ]);
        setStore(storeResponse.data.data);
        setCurrentRating(ratingResponse.data.data.rating);
        setRating(ratingResponse.data.data.rating);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch store details or current rating");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:3001/user/rating/${id}`,
        { rating },
        { withCredentials: true }
      );
      setSuccess("Rating updated successfully!");
      setTimeout(() => {
        navigate("/user/stores");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to update rating");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Rating</h2>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {store && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
            <p className="mt-1 text-gray-600">{store.address}</p>
            {currentRating && (
              <p className="mt-2 text-sm font-medium text-gray-500">
                Current Rating: {currentRating} stars
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Star' : 'Stars'}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Update Rating
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateRating;
