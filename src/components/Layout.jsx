import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useState } from 'react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Pages that should hide navbar on mobile (but keep bottom nav)
  const hideNavbarPages = ['/ai-study-assistant'];
  const shouldHideNavbar = hideNavbarPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        className={shouldHideNavbar ? 'md:block hidden' : ''}
      />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-1 lg:ml-64 ${shouldHideNavbar ? 'md:mt-16 md:p-6 md:mb-0' : 'p-4 md:p-6 mt-16 mb-16 md:mb-0'}`}>
          <div className={shouldHideNavbar ? '' : 'max-w-7xl mx-auto'}>
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};

export default Layout;

