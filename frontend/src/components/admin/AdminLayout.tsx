import { Outlet, Link } from "react-router-dom";
import Navbar from "../Navbar";

const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 border-r">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <ul className="space-x-4">
            <li>
              <Link
                to="/admin/stats"
                className="block p-2 rounded hover:bg-gray-200 "
              >
                Statistics
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add-store"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Add Store
              </Link>
            </li>
            <li>
              <Link
                to="/admin/update-role"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Update User Role
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="block p-2 rounded hover:bg-gray-200"
              >
                User List
              </Link>
            </li>
            <li>
              <Link
                to="/admin/delete-user"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Delete User
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
