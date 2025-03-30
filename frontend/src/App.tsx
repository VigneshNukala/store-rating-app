import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { RoleProvider } from "./context/RoleContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Signup from "./components/Signup";
import Signin from "./components/Signin";

import AdminLayout from "./components/admin/AdminLayout";
import Statistics from "./components/admin/Statistics";
import AddStore from "./components/admin/AddStore";
import UpdateUserRole from "./components/admin/UpdateUserRole";
import UserList from "./components/admin/UserList";
import DeleteUser from "./components/admin/DeleteUser";

import UserLayout from "./components/user/UserLayout";
import StoreList from "./components/user/StoreList";
import StoreDetails from "./components/user/StoreDetails";
import SubmitRating from "./components/user/SubmitRating";
import UpdateRating from "./components/user/UpdateRating";
import StoreRatings from "./components/user/StoreRatings";
import UserRatings from "./components/user/UserRatings";

import OwnerLayout from "./components/store-owner/OwnerLayout";

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
              <Route path="update-role" element={<UpdateUserRole />} />
              <Route path="users" element={<UserList />} />
              <Route path="delete-user" element={<DeleteUser />} />
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
            </Route>

            {/* Store Owner Routes */}
            <Route
              path="/store-owner"
              element={
                <ProtectedRoute requiredRole="store-owner">
                  <OwnerLayout />
                </ProtectedRoute>
              }
            ></Route>

            {/* New User Routes */}
            <Route path="/users/stores" element={<StoreList />} />
            <Route path="/users/stores/:id" element={<StoreDetails />} />
            <Route path="/users/submit-rating" element={<SubmitRating />} />
            <Route path="/users/update-rating" element={<UpdateRating />} />
            <Route
              path="/users/ratings/store/:storeId"
              element={<StoreRatings />}
            />
            <Route
              path="/users/ratings/user/:userId"
              element={<UserRatings />}
            />
          </Routes>
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
};

export default App;
