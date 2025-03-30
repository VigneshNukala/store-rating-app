import { useState, useEffect, useCallback } from "react";
import api from "../../utils/axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setError("");
      const response = await api.get(
        `admin/users?name=${nameSearch}&role=${roleSearch}&email=${emailSearch}`,
        {
          withCredentials: true,
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", error);
    }
  }, [nameSearch, roleSearch, emailSearch]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [nameSearch, roleSearch, emailSearch, fetchUsers]);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>

        <div className="flex gap-4 flex-wrap">
          <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
            />
          </div>
          <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by role..."
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
            />
          </div>
          <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } overflow-hidden shadow-lg rounded-lg divide-y divide-gray-200 border-2 border-gray-200 hover:border-primary-500 transition-colors duration-200`}
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                {user.name}
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  #{user.id}
                </span>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <dl>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {user.role}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
