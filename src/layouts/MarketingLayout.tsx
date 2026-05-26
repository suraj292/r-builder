import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
