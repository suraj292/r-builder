import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from '../pages/marketing/Home';
import About from '../pages/marketing/About';
import AtsChecker from '../pages/marketing/AtsChecker';
import Contact from '../pages/marketing/Contact';
import Faq from '../pages/marketing/Faq';
import Pricing from '../pages/marketing/Pricing';
import BlogListing from '../pages/blog/BlogListing';
import BlogDetail from '../pages/blog/BlogDetail';
import Checkout from '../pages/user/Checkout';
import MyResumes from '../pages/user/MyResumes';
import Profile from '../pages/user/Profile';
import LoginSignup from '../pages/auth/LoginSignup';
import AuthCallback from '../pages/auth/AuthCallback';
import ResetPassword from '../pages/auth/ResetPassword';
import AdminLayout from '../layouts/AdminLayout';
import AdminGuard from '../components/auth/AdminGuard';
import AuthGuard from '../components/auth/AuthGuard';
import GuestGuard from '../components/auth/GuestGuard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminUserDetail from '../pages/admin/AdminUserDetail';
import AdminResumes from '../pages/admin/AdminResumes';
import AdminPlans from '../pages/admin/AdminPlans';
import AdminTemplates from '../pages/admin/AdminTemplates';
import AdminSubscriptions from '../pages/admin/AdminSubscriptions';
import AdminSubscriptionDetail from '../pages/admin/AdminSubscriptionDetail';
import AdminAI from '../pages/admin/AdminAI';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminPlaceholder from '../components/admin/AdminPlaceholder';
import Privacy from '../pages/legal/Privacy';
import Terms from '../pages/legal/Terms';
import RefundPolicy from '../pages/legal/RefundPolicy';
import ShippingPolicy from '../pages/legal/ShippingPolicy';
import { Workspace } from '../components/editor/Workspace';
import MarketingLayout from '../layouts/MarketingLayout';
import BuilderLayout from '../layouts/BuilderLayout';
import AuthLayout from '../layouts/AuthLayout';
import UserDashboardLayout from '../layouts/UserDashboardLayout';
import LegalLayout from '../layouts/LegalLayout';
import UpgradeModal from '../components/subscription/UpgradeModal';

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Outlet /><UpgradeModal /></>,
    children: [
      {
        path: '/',
        element: <MarketingLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'about', element: <About /> },
          { path: 'ats-checker', element: <AtsChecker /> },
          { path: 'contact', element: <Contact /> },
          { path: 'faq', element: <Faq /> },
          { path: 'pricing', element: <Pricing /> },
        ]
      },
      {
        path: '/blog',
        element: <MarketingLayout />,
        children: [
          { index: true, element: <BlogListing /> },
          { path: ':slug', element: <BlogDetail /> },
        ]
      },
      {
        path: '/builder',
        element: <AuthGuard><BuilderLayout /></AuthGuard>,
        children: [
          { index: true, element: <Workspace /> },
          { path: 'editor', element: <Workspace /> },
        ]
      },
      {
        path: '/auth',
        element: <GuestGuard><AuthLayout /></GuestGuard>,
        children: [
          { path: 'login', element: <LoginSignup /> },
          { path: 'signup', element: <LoginSignup /> },
          { path: 'callback', element: <AuthCallback /> },
          { path: 'reset-password', element: <ResetPassword /> },
        ]
      },
      {
        path: '/admin',
        element: <AuthGuard><AdminGuard><AdminLayout /></AdminGuard></AuthGuard>,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'users/:id', element: <AdminUserDetail /> },
          { path: 'resumes', element: <AdminResumes /> },
          { path: 'subscriptions', element: <AdminSubscriptions /> },
          { path: 'subscriptions/:userId', element: <AdminSubscriptionDetail /> },
          { path: 'plans', element: <AdminPlans /> },
          { path: 'templates', element: <AdminTemplates /> },
          { path: 'ai', element: <AdminAI /> },

          { path: 'settings', element: <AdminSettings /> },
        ]
      },
      {
        path: '/user',
        element: <AuthGuard><UserDashboardLayout /></AuthGuard>,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'resumes', element: <MyResumes /> },
          { path: 'checkout', element: <Checkout /> },
        ]
      },
      {
        path: '/legal',
        element: <LegalLayout />,
        children: [
          { path: 'privacy', element: <Privacy /> },
          { path: 'terms', element: <Terms /> },
          { path: 'refund-policy', element: <RefundPolicy /> },
          { path: 'shipping-policy', element: <ShippingPolicy /> },
        ]
      }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
