import { Link, Outlet, useLocation } from "react-router-dom";
import { KeyIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/outline';
import Navbar from "../Navbar";

const navigation = [
  { name: 'Change Password', href: '/owner/password', icon: KeyIcon },
  { name: 'Statistics', href: '/owner/statistics', icon: ChartBarIcon },
  { name: 'Store Ratings', href: '/owner/ratings', icon: StarIcon },
];

const OwnerLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-b md:border-r border-gray-200">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-900">Store Owner Dashboard</h2>
            <nav className="mt-5 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-primary-900' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
