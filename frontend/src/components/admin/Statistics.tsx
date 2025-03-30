import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Stats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  averageRating: number;
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin/stats", {
          withCredentials: true,
        });
        setStats(response.data.data);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-6">
        Admin Dashboard Statistics
      </h2>
      {stats && (
        <div className="space-y-4">
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Total Stores", value: stats.totalStores },
            { label: "Total Ratings", value: stats.totalRatings },
            { label: "Average Rating", value: stats.averageRating.toFixed(2) },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
            >
              <div className="flex-grow">
                <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </span>
                <span className="text-lg font-bold">{stat.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Statistics;
