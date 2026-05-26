import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import AdminLayout from '../layouts/AdminLayout';
import AdminGuard from '../components/auth/AdminGuard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminResumes from '../pages/admin/AdminResumes';
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

const router = createBrowserRouter([
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
    element: <BuilderLayout />,
    children: [
      { index: true, element: <Workspace /> },
      { path: 'editor', element: <Workspace /> },
      // Templates and themes will go here
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginSignup /> },
      { path: 'signup', element: <LoginSignup /> },
      { path: 'callback', element: <AuthCallback /> },
    ]
  },
  {
    path: '/admin',
    element: <AdminGuard><AdminLayout /></AdminGuard>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'resumes', element: <AdminResumes /> },
      { path: 'templates', element: <AdminPlaceholder title="Template Management" /> },
      { path: 'ai', element: <AdminAI /> },
      { path: 'settings', element: <AdminSettings /> },
    ]
  },
  {
    path: '/user',
    element: <UserDashboardLayout />,
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
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
