import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  interface DashboardData {
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/admin/dashboard",
          {
            withCredentials: true,
          }
        );
        console.log(response)
        setDashboardData(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">{dashboardData.totalUsers}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Total Stores</h2>
          <p className="text-2xl">{dashboardData.totalStores}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Total Ratings</h2>
          <p className="text-2xl">{dashboardData.totalRatings}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
