import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoadingScreen from '../components/common/LoadingScreen';

// Layouts - Keep layouts static for better UX during navigation
import MarketingLayout from '../layouts/MarketingLayout';
import BuilderLayout from '../layouts/BuilderLayout';
import AuthLayout from '../layouts/AuthLayout';
import UserDashboardLayout from '../layouts/UserDashboardLayout';
import LegalLayout from '../layouts/LegalLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guards - Keep guards static
import AdminGuard from '../components/auth/AdminGuard';
import AuthGuard from '../components/auth/AuthGuard';
import GuestGuard from '../components/auth/GuestGuard';

// Shared Components
import UpgradeModal from '../components/subscription/UpgradeModal';
import SEOHead from '../components/shared/SEOHead';

// Lazy Pages - Marketing
const Home = lazy(() => import('../pages/marketing/Home'));
const About = lazy(() => import('../pages/marketing/About'));
const AtsChecker = lazy(() => import('../pages/marketing/AtsChecker'));
const Contact = lazy(() => import('../pages/marketing/Contact'));
const Faq = lazy(() => import('../pages/marketing/Faq'));
const Pricing = lazy(() => import('../pages/marketing/Pricing'));
const NotFound = lazy(() => import('../pages/marketing/NotFound'));

// Lazy Pages - Blog
const BlogListing = lazy(() => import('../pages/blog/BlogListing'));
const BlogDetail = lazy(() => import('../pages/blog/BlogDetail'));

// Lazy Pages - Auth
const LoginSignup = lazy(() => import('../pages/auth/LoginSignup'));
const AuthCallback = lazy(() => import('../pages/auth/AuthCallback'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Lazy Pages - User
const Checkout = lazy(() => import('../pages/user/Checkout'));
const MyResumes = lazy(() => import('../pages/user/MyResumes'));
const Profile = lazy(() => import('../pages/user/Profile'));

// Lazy Pages - Admin
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('../pages/admin/AdminUserDetail'));
const AdminResumes = lazy(() => import('../pages/admin/AdminResumes'));
const AdminPlans = lazy(() => import('../pages/admin/AdminPlans'));
const AdminTemplates = lazy(() => import('../pages/admin/AdminTemplates'));
const AdminSubscriptions = lazy(() => import('../pages/admin/AdminSubscriptions'));
const AdminSubscriptionDetail = lazy(() => import('../pages/admin/AdminSubscriptionDetail'));
const AdminCoupons = lazy(() => import('../pages/admin/AdminCoupons'));
const AdminBlog = lazy(() => import('../pages/admin/AdminBlog'));
const BlogEditor = lazy(() => import('../pages/admin/BlogEditor'));
const AdminSEO = lazy(() => import('../pages/admin/AdminSEO'));
const AdminAI = lazy(() => import('../pages/admin/AdminAI'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

// Lazy Pages - Visibility
const VisibilitySettings = lazy(() => import('../pages/admin/visibility/VisibilitySettings'));
const GoogleManagement = lazy(() => import('../pages/admin/visibility/GoogleManagement'));
const SocialMediaManagement = lazy(() => import('../pages/admin/visibility/SocialMediaManagement'));
const SchemaManager = lazy(() => import('../pages/admin/visibility/SchemaManager'));
const SearchEngines = lazy(() => import('../pages/admin/visibility/SearchEngines'));
const AIDiscoveryCenter = lazy(() => import('../pages/admin/visibility/AIDiscoveryCenter'));
const ContentOptimizer = lazy(() => import('../pages/admin/visibility/ContentOptimizer'));
const AIContentStudio = lazy(() => import('../pages/admin/visibility/AIContentStudio'));
const TrustCenter = lazy(() => import('../pages/admin/visibility/TrustCenter'));
const SiteAudit = lazy(() => import('../pages/admin/visibility/SiteAudit'));
const VisibilityExecutiveDashboard = lazy(() => import('../pages/admin/visibility/VisibilityExecutiveDashboard'));
const AnalyticsCenter = lazy(() => import('../pages/admin/visibility/AnalyticsCenter'));
const BrandingManagement = lazy(() => import('../pages/admin/visibility/BrandingManagement'));

// Lazy Pages - Legal
const Privacy = lazy(() => import('../pages/legal/Privacy'));
const Terms = lazy(() => import('../pages/legal/Terms'));
const RefundPolicy = lazy(() => import('../pages/legal/RefundPolicy'));
const ShippingPolicy = lazy(() => import('../pages/legal/ShippingPolicy'));

// Editor
const Workspace = lazy(() => import('../components/editor/Workspace').then(m => ({ default: m.Workspace })));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <SEOHead />
        <Outlet />
        <UpgradeModal />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingScreen />}>
        <NotFound />
      </Suspense>
    ),
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
