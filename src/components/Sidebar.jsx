import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Stethoscope,
  FlaskConical,
  ClipboardList,
  Brain,
  CreditCard,
  LayoutDashboard,
  Info,
  X,
  Users,
  Shield,
  BarChart3,
  GraduationCap,
  TrendingUp,
  FileText,
  Bookmark,
  MessageSquare,
  UsersRound,
  FileCheck,
  Share2,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import { getUserRole } from '../utils/auth';

// Menu items for students
const studentMenuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
  { icon: MessageSquare, label: 'Discussions', path: '/discussions' },
  { icon: UsersRound, label: 'Study Groups', path: '/study-groups' },
  { icon: FileCheck, label: 'Peer Reviews', path: '/peer-reviews' },
  { icon: Share2, label: 'Shared Resources', path: '/shared-resources' },
  { icon: Sparkles, label: 'AI Study Assistant', path: '/ai-study-assistant' },
  { icon: Stethoscope, label: 'OSCE Coach', path: '/osce-coach' },
  { icon: FileText, label: 'Case Generator', path: '/case-generator' },
  { icon: GraduationCap, label: 'Years', path: '/years' },
  { icon: BookOpen, label: 'Subjects', path: '/subjects' },
  { icon: Stethoscope, label: 'Clinical Skills', path: '/clinical-skills' },
  { icon: FlaskConical, label: 'Labs', path: '/labs' },
  { icon: ClipboardList, label: 'OSCE Stations', path: '/osce' },
  { icon: Brain, label: 'Quizzes', path: '/quizzes' },
  { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
  { icon: Info, label: 'About', path: '/about' },
];

// Menu items for teachers
const teacherMenuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
  { icon: MessageSquare, label: 'Discussions', path: '/discussions' },
  { icon: UsersRound, label: 'Study Groups', path: '/study-groups' },
  { icon: FileCheck, label: 'Peer Reviews', path: '/peer-reviews' },
  { icon: Share2, label: 'Shared Resources', path: '/shared-resources' },
  { icon: Sparkles, label: 'AI Study Assistant', path: '/ai-study-assistant' },
  { icon: Stethoscope, label: 'OSCE Coach', path: '/osce-coach' },
  { icon: FileText, label: 'Case Generator', path: '/case-generator' },
  { icon: GraduationCap, label: 'Years', path: '/years' },
  { icon: BookOpen, label: 'Subjects', path: '/subjects' },
  { icon: Brain, label: 'Quizzes', path: '/quizzes' },
  { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
  { icon: FlaskConical, label: 'Labs', path: '/labs' },
  { icon: ClipboardList, label: 'OSCE Stations', path: '/osce' },
  { icon: Stethoscope, label: 'Clinical Skills', path: '/clinical-skills' },
  { icon: Info, label: 'About', path: '/about' },
];

// Menu items for admins
const adminMenuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
  { icon: MessageSquare, label: 'Discussions', path: '/discussions' },
  { icon: UsersRound, label: 'Study Groups', path: '/study-groups' },
  { icon: FileCheck, label: 'Peer Reviews', path: '/peer-reviews' },
  { icon: Share2, label: 'Shared Resources', path: '/shared-resources' },
  { icon: Sparkles, label: 'AI Study Assistant', path: '/ai-study-assistant' },
  { icon: Stethoscope, label: 'OSCE Coach', path: '/osce-coach' },
  { icon: FileText, label: 'Case Generator', path: '/case-generator' },
  { icon: GraduationCap, label: 'Years', path: '/years' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: BookOpen, label: 'Content Management', path: '/subjects' },
  { icon: Shield, label: 'Settings', path: '/settings' },
  { icon: Info, label: 'About', path: '/about' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const userRole = getUserRole();

  // Select menu items based on user role
  const menuItems =
    userRole === 'admin' ? adminMenuItems :
    userRole === 'teacher' ? teacherMenuItems :
    studentMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end p-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-6 h-6 dark:text-gray-300" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 text-center">
              lstBooks v1.0
              <br />
              Dental Learning Platform
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

