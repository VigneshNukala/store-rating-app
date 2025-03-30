import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { RoleProvider } from "./context/RoleContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Signup from "./components/Signup";
import Signin from "./components/Signin";

import AdminLayout from "./components/admin/AdminLayout";
import Statistics from "./components/admin/Statistics";
import AddStore from "./components/admin/AddStore";
import AddUser from "./components/admin/AddUser";

import UserList from "./components/admin/UserList";
import StoresList from "./components/admin/StoresList";

import UserLayout from "./components/user/UserLayout";
import StoreList from "./components/user/StoreList";
import StoreDetails from "./components/user/StoreDetails";
import SubmitRating from "./components/user/SubmitRating";
import UpdateRating from "./components/user/UpdateRating";
import UsersList from "./components/user/UsersList";

import OwnerLayout from "./components/store-owner/OwnerLayout";
import ChangePassword from "./components/store-owner/ChangePassword";
import StoreRatings from "./components/store-owner/StoreRatings";
import OwnerStatistics from "./components/store-owner/Statistics";

const App = () => {
  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="stats" element={<Statistics />} />
              <Route path="add-store" element={<AddStore />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="users" element={<UserList />} />
              <Route path="stores" element={<StoresList />} />
            </Route>

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="stores" element={<StoreList />} />
              <Route path="stores/:id" element={<StoreDetails />} />
              <Route path="submit-rating/:id" element={<SubmitRating />} />
              <Route path="update-rating/:id" element={<UpdateRating />} />
              <Route path="users" element={<UsersList />} />
            </Route>

            {/* Store Owner Routes */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="password" element={<ChangePassword />} />
              <Route path="ratings" element={<StoreRatings />} />
              <Route path="statistics" element={<OwnerStatistics />} />
            </Route>
          </Routes>
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
};

export default App;
