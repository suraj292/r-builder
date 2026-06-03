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
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminBlog from '../pages/admin/AdminBlog';
import BlogEditor from '../pages/admin/BlogEditor';
import AdminSEO from '../pages/admin/AdminSEO';
import AdminAI from '../pages/admin/AdminAI';
import AdminSettings from '../pages/admin/AdminSettings';

import VisibilitySettings from '../pages/admin/visibility/VisibilitySettings';
import GoogleManagement from '../pages/admin/visibility/GoogleManagement';
import SocialMediaManagement from '../pages/admin/visibility/SocialMediaManagement';
import SchemaManager from '../pages/admin/visibility/SchemaManager';
import SearchEngines from '../pages/admin/visibility/SearchEngines';
import AIDiscoveryCenter from '../pages/admin/visibility/AIDiscoveryCenter';
import ContentOptimizer from '../pages/admin/visibility/ContentOptimizer';
import AIContentStudio from '../pages/admin/visibility/AIContentStudio';
import TrustCenter from '../pages/admin/visibility/TrustCenter';
import SiteAudit from '../pages/admin/visibility/SiteAudit';
import VisibilityExecutiveDashboard from '../pages/admin/visibility/VisibilityExecutiveDashboard';
import AnalyticsCenter from '../pages/admin/visibility/AnalyticsCenter';
import BrandingManagement from '../pages/admin/visibility/BrandingManagement';

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
import NotFound from '../pages/marketing/NotFound';
import SEOHead from '../components/shared/SEOHead';

const router = createBrowserRouter([
  {
    path: '/',
    element: <><SEOHead /><Outlet /><UpgradeModal /></>,
    errorElement: <NotFound />,
    children: [
      {
        path: 'admin',
        element: <AuthGuard><AdminGuard><AdminLayout /></AdminGuard></AuthGuard>,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'users/:id', element: <AdminUserDetail /> },
          { path: 'resumes', element: <AdminResumes /> },
          { path: 'subscriptions', element: <AdminSubscriptions /> },
          { path: 'subscriptions/:userId', element: <AdminSubscriptionDetail /> },
          { path: 'coupons', element: <AdminCoupons /> },
          { path: 'plans', element: <AdminPlans /> },
          { path: 'templates', element: <AdminTemplates /> },
          { path: 'blog', element: <AdminBlog /> },
          { path: 'blog/create', element: <BlogEditor /> },
          { path: 'blog/edit/:id', element: <BlogEditor /> },
          { path: 'seo', element: <AdminSEO /> },
          { path: 'ai', element: <AdminAI /> },
          { path: 'settings', element: <AdminSettings /> },
          
          { path: 'visibility/settings', element: <VisibilitySettings /> },
          { path: 'visibility/google', element: <GoogleManagement /> },
          { path: 'visibility/social', element: <SocialMediaManagement /> },
          { path: 'visibility/schema', element: <SchemaManager /> },
          { path: 'visibility/engines', element: <SearchEngines /> },
          { path: 'visibility/ai', element: <AIDiscoveryCenter /> },
          { path: 'visibility/optimizer', element: <ContentOptimizer /> },
          { path: 'visibility/studio', element: <AIContentStudio /> },
          { path: 'visibility/trust', element: <TrustCenter /> },
          { path: 'visibility/audit', element: <SiteAudit /> },
          { path: 'visibility/analytics', element: <AnalyticsCenter /> },
          { path: 'visibility/branding', element: <BrandingManagement /> },
          { path: 'visibility/dashboard', element: <VisibilityExecutiveDashboard /> },
        ]
      },
      {
        path: 'builder',
        element: <AuthGuard><BuilderLayout /></AuthGuard>,
        children: [
          { index: true, element: <Workspace /> },
          { path: 'editor', element: <Workspace /> },
        ]
      },
      {
        path: 'auth',
        element: <GuestGuard><AuthLayout /></GuestGuard>,
        children: [
          { path: 'login', element: <LoginSignup /> },
          { path: 'signup', element: <LoginSignup /> },
          { path: 'callback', element: <AuthCallback /> },
          { path: 'reset-password', element: <ResetPassword /> },
        ]
      },
      {
        path: 'user',
        element: <AuthGuard><UserDashboardLayout /></AuthGuard>,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'resumes', element: <MyResumes /> },
          { path: 'checkout', element: <Checkout /> },
        ]
      },
      {
        path: 'legal',
        element: <LegalLayout />,
        children: [
          { path: 'privacy', element: <Privacy /> },
          { path: 'terms', element: <Terms /> },
          { path: 'refund-policy', element: <RefundPolicy /> },
          { path: 'shipping-policy', element: <ShippingPolicy /> },
        ]
      },
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
          {
            path: 'blog',
            children: [
              { index: true, element: <BlogListing /> },
              { path: ':slug', element: <BlogDetail /> },
            ]
          },
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
