import { useState, useEffect } from "react";
import axios from "axios";

interface RatingStats {
  average_rating: number | null;
  total_ratings: number;
  lowest_rating: number | null;
  highest_rating: number | null;
}

const StoreRatings = () => {
  const [ratingStats, setRatingStats] = useState<RatingStats>({
    average_rating: null,
    total_ratings: 0,
    lowest_rating: null,
    highest_rating: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/owner/average-rating",
        {
          withCredentials: true,
        }
      );
      if (response.data.status === "success") {
        setRatingStats(response.data.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch ratings");
    }
  };

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center">
        <h2 className="text-2xl font-bold text-gray-900">Store Ratings Overview</h2>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {ratingStats.total_ratings === 0 ? (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6">
          <p className="text-gray-500">No ratings found for your stores.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Average Rating', value: ratingStats.average_rating?.toFixed(1) || 'N/A', icon: '⭐' },
            { label: 'Total Ratings', value: ratingStats.total_ratings, icon: '📊' },
            { label: 'Highest Rating', value: ratingStats.highest_rating || 'N/A', icon: '📈' },
            { label: 'Lowest Rating', value: ratingStats.lowest_rating || 'N/A', icon: '📉' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow-sm rounded-lg overflow-hidden ring-1 ring-gray-900/5"
            >
              <dt>
                <div className="absolute rounded-md bg-primary-100 p-3">
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.label}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreRatings;
