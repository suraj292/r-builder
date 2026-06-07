import { Outlet } from 'react-router-dom';
// import DashboardSidebar from '../components/user/DashboardSidebar';

export default function UserDashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* <DashboardSidebar /> */}
      <div className="flex-1 flex flex-col">
        {/* <DashboardHeader /> */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
