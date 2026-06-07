import { Outlet } from 'react-router-dom';

export default function BuilderLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">
      <Outlet />
    </div>
  );
}
