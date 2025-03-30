import { useState, useEffect } from "react";
import api from "../../utils/axios";

interface Statistics {
  averageRating: number;
  totalRatings: number;
}

const OwnerStatistics = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get("/owner/ratings", {
        withCredentials: true,
      });
      console.log(response.data.data);
      if (response.data.status === "success") {
        setStatistics(response.data.data);
        setError("");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch statistics");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Store Performance
        </h2>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {statistics && statistics.totalRatings === 0 ? (
          <p className="text-gray-500">
            No ratings have been submitted for your stores yet.
          </p>
        ) : (
          statistics && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-primary-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500">
                  Average Rating
                </h3>
                <p className="mt-2 text-3xl font-semibold text-primary-700">
                  {statistics.averageRating}
                </p>
              </div>
              <div className="bg-primary-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Ratings
                </h3>
                <p className="mt-2 text-3xl font-semibold text-primary-700">
                  {statistics.totalRatings}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OwnerStatistics;
