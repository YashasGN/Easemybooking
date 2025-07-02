import { createBrowserRouter, Navigate } from 'react-router-dom';

import Home from './components/HomePage/Home/home';
import Login from './authentication/login/login';
import Register from './authentication/register/register';
import MainPage from './components/HomePage/mainPage';
import ZooList from './components/subCategory/zooList';
import CardDetails from './components/cardDetails/cardDetails';
import Booking from './components/Booking/Booking';
import AdminDashboardWrapper from './components/admin/adminDashboardWrapper';
import MyBooking from './components/Booking/myBookingDetails/myBooking';
import OrganiserDashboard from './components/organiser/organiserDashboard/organiserDashboard';
import PlaceDetails from './components/organiser/placeDetails/placeDetails';
import ProtectedRoute from './protectedRoute';
import FooterPage from './components/HomePage/footer/FooterPage';
const AppRouter = createBrowserRouter([
  {
    path: '/',
    Component: Home,
    children: [
      // Redirect `/` to `/mysore`
      { index: true, element: <Navigate to="/mysore" replace /> },

      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: ':city', Component: MainPage },
      { path: ':city/:category', Component: ZooList },
      { path: ':city/:category/:packageId', Component: CardDetails },
      { path: 'booking/:packageId', Component: Booking },
      { path: 'carddetails/:packageId', Component: CardDetails },
      { path: 'mybookings', Component: MyBooking },
      {path: 'footer-page', Component: FooterPage},

      {
        path: 'organiser/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['Organiser']}>
            <OrganiserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'organiser/place/:id/details',
        element: (
          <ProtectedRoute allowedRoles={['Organiser']}>
            <PlaceDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboardWrapper />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default AppRouter;
