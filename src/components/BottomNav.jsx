import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Sparkles,
  BarChart3,
  Menu,
  Users,
  Upload,
  Shield,
  CheckSquare,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const BottomNav = ({ onMenuClick, className = '' }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Define bottom nav items based on role
  const getNavItems = () => {
    const role = user?.role || 'student';

    const navItems = {
      student: [
        { icon: Home, label: 'Home', path: '/', id: 'home' },
        { icon: BookOpen, label: 'Learn', path: '/subjects', id: 'learn' },
        { icon: Sparkles, label: 'AI', path: '/ai-study-assistant', id: 'ai' },
        { icon: BarChart3, label: 'Progress', path: '/analytics', id: 'progress' },
        { icon: Menu, label: 'More', action: 'menu', id: 'more' },
      ],
      teacher: [
        { icon: Home, label: 'Home', path: '/', id: 'home' },
        { icon: Users, label: 'Students', path: '/student-analytics', id: 'students' },
        { icon: Upload, label: 'Upload', path: '/resource-center', id: 'upload' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics', id: 'analytics' },
        { icon: Menu, label: 'More', action: 'menu', id: 'more' },
      ],
      admin: [
        { icon: Home, label: 'Home', path: '/', id: 'home' },
        { icon: Users, label: 'Users', path: '/admin/users', id: 'users' },
        { icon: CheckSquare, label: 'Approve', path: '/admin/content', id: 'approve' },
        { icon: Shield, label: 'Analytics', path: '/admin/analytics', id: 'analytics' },
        { icon: Menu, label: 'More', action: 'menu', id: 'more' },
      ],
    };

    return navItems[role] || navItems.student;
  };

  const navItems = getNavItems();

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleItemClick = (item) => {
    if (item.action === 'menu') {
      onMenuClick();
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-bottom ${className}`}>
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            if (item.action === 'menu') {
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="flex flex-col items-center justify-center gap-1 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700"
                >
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </div>
                <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for bottom nav - Mobile Only */}
      <div className={`md:hidden h-16 ${className}`} />
    </>
  );
};

export default BottomNav;

