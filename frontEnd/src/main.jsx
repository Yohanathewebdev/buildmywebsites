import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Services from './pages/Service.jsx';
import Darshboard from './pages/Darshboard.jsx';
import PlaceOrder from './pages/PlaceOrder.jsx';
import MyOrders from './pages/MyOrders.jsx'; // User orders page
import Payment from './pages/Payment.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import { UserProvider } from './UserContext.jsx';
import ProtectedRoute from './protectedRoute.jsx';
import AdminServices from './pages/AdminServices.jsx';
import AdminCreateService from './pages/AdminCreateServices.jsx';
import AdminEditService from './pages/AdminEditServices.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 🌍 Public pages
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      

      // 🔐 Protected pages
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "darshboard",
        element: (
          <ProtectedRoute>
            <Darshboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "placeorder",
        element: (
          <ProtectedRoute>
            <PlaceOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment/:orderId",
        element: (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        ),
      },

      // 🛠 Admin Dashboard route
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
  path: "admin/users",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },

      {
        path: "admin/services",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminServices />
          </ProtectedRoute>
        ),
      },
{
  path: "admin/services/create",
  element: (
    <ProtectedRoute>
      <AdminCreateService/>
    </ProtectedRoute>
  )

},
{
  path: "admin/services/edit/:id",
  element: (
    <ProtectedRoute>
      <AdminEditService/>
    </ProtectedRoute>
  )

},

      {
  path: "admin/orders",
  element: (
    <ProtectedRoute adminOnly>
      <AdminOrders />
    </ProtectedRoute>
  ),
},
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
