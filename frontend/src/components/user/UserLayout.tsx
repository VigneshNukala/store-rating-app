import { Outlet, Link, useLocation } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import {
  StarIcon,
  BuildingStorefrontIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Navbar from "../Navbar";

const navigation = [
  { name: "Stores", href: "/user/stores", icon: BuildingStorefrontIcon },
  { name: "Users", href: "/user/users", icon: StarIcon },
];

const UserLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <button
          className="md:hidden fixed top-16 left-4 z-50 p-2 rounded-md bg-white border border-gray-200"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </button>

        <Disclosure
          as="nav"
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block fixed md:static w-64 bg-white border-r border-gray-200 h-screen z-40`}
        >
          {() => (
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                User Panel
              </h2>
              <div className="mt-5 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? "bg-primary-100 text-primary-900"
                          : "text-gray-600 hover:bg-gray-50"
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className={`${
                          isActive
                            ? "text-primary-900"
                            : "text-gray-400 group-hover:text-gray-500"
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </Disclosure>

        <main className="flex-1 p-4 md:p-8 md:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
