import { useState, useEffect } from 'react';
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
  Target,
  FileText,
  Bookmark,
  MessageSquare,
  UsersRound,
  FileCheck,
  Share2,
  Sparkles,
  Trophy,
  Award,
  HelpCircle,
  Image,
  Upload,
  Calendar,
  Syringe,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';
import clsx from 'clsx';
import { getUserRole } from '../utils/auth';

// Organized menu structure with collapsible sections
const menuStructure = {
  student: [
    {
      type: 'pinned',
      items: [
        { icon: Home, label: 'Home', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      type: 'section',
      title: 'Learning Content',
      icon: BookOpen,
      defaultOpen: true,
      items: [
        { icon: GraduationCap, label: 'Years', path: '/years' },
        { icon: BookOpen, label: 'Subjects', path: '/subjects' },
        { icon: Stethoscope, label: 'Clinical Skills', path: '/clinical-skills' },
        { icon: FlaskConical, label: 'Labs', path: '/labs' },
        { icon: ClipboardList, label: 'OSCE Stations', path: '/osce' },
        { icon: Syringe, label: 'Treatment Protocols', path: '/treatment-protocols' },
      ]
    },
    {
      type: 'section',
      title: 'Study Tools',
      icon: Brain,
      defaultOpen: true,
      items: [
        { icon: Brain, label: 'Quizzes', path: '/quizzes' },
        { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
        { icon: TrendingUp, label: 'Spaced Repetition', path: '/spaced-repetition' },
        { icon: BookOpen, label: 'Books', path: '/books' },
        { icon: FileText, label: 'Past Papers', path: '/past-papers' },
        { icon: Image, label: 'Photo Library', path: '/photos' },
        { icon: FileText, label: 'Notes', path: '/notes' },
        { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
      ]
    },
    {
      type: 'section',
      title: 'AI Assistants',
      icon: Sparkles,
      defaultOpen: false,
      items: [
        { icon: Sparkles, label: 'AI Study Assistant', path: '/ai-study-assistant' },
        { icon: Zap, label: 'AI Quiz Generator', path: '/ai-quiz-generator' },
        { icon: Stethoscope, label: 'OSCE Coach', path: '/osce-coach' },
        { icon: FlaskConical, label: 'Case Generator', path: '/case-generator' },
        { icon: HelpCircle, label: 'AI Guide', path: '/ai-guide' },
      ]
    },
    {
      type: 'section',
      title: 'Progress & Analytics',
      icon: BarChart3,
      defaultOpen: false,
      items: [
        { icon: TrendingUp, label: 'Progress', path: '/progress' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Brain, label: 'AI Performance', path: '/performance' },
      ]
    },
    {
      type: 'section',
      title: 'Gamification',
      icon: Trophy,
      defaultOpen: false,
      items: [
        { icon: Trophy, label: 'Gamification', path: '/gamification' },
        { icon: Award, label: 'Achievements', path: '/achievements' },
        { icon: Target, label: 'Challenges', path: '/challenges' },
        { icon: BarChart3, label: 'Leaderboard', path: '/leaderboard' },
      ]
    },
    {
      type: 'section',
      title: 'Social',
      icon: UsersRound,
      defaultOpen: false,
      items: [
        { icon: MessageSquare, label: 'Discussions', path: '/discussions' },
        { icon: UsersRound, label: 'Study Groups', path: '/study-groups' },
        { icon: FileCheck, label: 'Peer Reviews', path: '/peer-reviews' },
        { icon: Share2, label: 'Shared Resources', path: '/shared-resources' },
      ]
    },
    {
      type: 'pinned',
      items: [
        { icon: Info, label: 'About', path: '/about' },
      ]
    }
  ],
  teacher: [
    {
      type: 'pinned',
      items: [
        { icon: Home, label: 'Home', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      type: 'section',
      title: 'Learning Content',
      icon: BookOpen,
      defaultOpen: true,
      items: [
        { icon: GraduationCap, label: 'Years', path: '/years' },
        { icon: BookOpen, label: 'Subjects', path: '/subjects' },
        { icon: Stethoscope, label: 'Clinical Skills', path: '/clinical-skills' },
        { icon: FlaskConical, label: 'Labs', path: '/labs' },
        { icon: ClipboardList, label: 'OSCE Stations', path: '/osce' },
        { icon: Syringe, label: 'Treatment Protocols', path: '/treatment-protocols' },
      ]
    },
    {
      type: 'section',
      title: 'Study Tools',
      icon: Brain,
      defaultOpen: true,
      items: [
        { icon: Brain, label: 'Quizzes', path: '/quizzes' },
        { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
        { icon: TrendingUp, label: 'Spaced Repetition', path: '/spaced-repetition' },
        { icon: BookOpen, label: 'Books', path: '/books' },
        { icon: FileText, label: 'Past Papers', path: '/past-papers' },
        { icon: Image, label: 'Photo Library', path: '/photos' },
        { icon: FileText, label: 'Notes', path: '/notes' },
        { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
      ]
    },
    {
      type: 'section',
      title: 'AI Assistants',
      icon: Sparkles,
      defaultOpen: false,
      items: [
        { icon: Sparkles, label: 'AI Study Assistant', path: '/ai-study-assistant' },
        { icon: Zap, label: 'AI Quiz Generator', path: '/ai-quiz-generator' },
        { icon: Stethoscope, label: 'OSCE Coach', path: '/osce-coach' },
        { icon: FlaskConical, label: 'Case Generator', path: '/case-generator' },
        { icon: HelpCircle, label: 'AI Guide', path: '/ai-guide' },
      ]
    },
    {
      type: 'section',
      title: 'Teacher Dashboard',
      icon: Users,
      defaultOpen: false,
      items: [
        { icon: Users, label: 'Student Analytics', path: '/student-analytics' },
        { icon: Upload, label: 'Resource Center', path: '/resource-center' },
        { icon: Calendar, label: 'Course Planner', path: '/course-planner' },
      ]
    },
    {
      type: 'section',
      title: 'Progress & Analytics',
      icon: BarChart3,
      defaultOpen: false,
      items: [
        { icon: TrendingUp, label: 'Progress', path: '/progress' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Brain, label: 'AI Performance', path: '/performance' },
      ]
    },
    {
      type: 'section',
      title: 'Gamification',
      icon: Trophy,
      defaultOpen: false,
      items: [
        { icon: Trophy, label: 'Gamification', path: '/gamification' },
        { icon: Award, label: 'Achievements', path: '/achievements' },
        { icon: Target, label: 'Challenges', path: '/challenges' },
        { icon: BarChart3, label: 'Leaderboard', path: '/leaderboard' },
      ]
    },
    {
      type: 'section',
      title: 'Social',
      icon: UsersRound,
      defaultOpen: false,
      items: [
        { icon: MessageSquare, label: 'Discussions', path: '/discussions' },
        { icon: UsersRound, label: 'Study Groups', path: '/study-groups' },
        { icon: FileCheck, label: 'Peer Reviews', path: '/peer-reviews' },
        { icon: Share2, label: 'Shared Resources', path: '/shared-resources' },
      ]
    },
    {
      type: 'pinned',
      items: [
        { icon: Info, label: 'About', path: '/about' },
      ]
    }
  ],
  admin: [
    {
      type: 'pinned',
      items: [
        { icon: Home, label: 'Home', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      type: 'section',
      title: 'Admin Management',
      icon: Shield,
      defaultOpen: true,
      items: [
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: FileCheck, label: 'Content Approval', path: '/admin/content' },
        { icon: BarChart3, label: 'Admin Analytics', path: '/admin/analytics' },
        { icon: Shield, label: 'Settings', path: '/settings' },
      ]
    },
    {
      type: 'section',
      title: 'Learning Content',
      icon: BookOpen,
      defaultOpen: false,
      items: [
        { icon: GraduationCap, label: 'Years', path: '/years' },
        { icon: BookOpen, label: 'Subjects', path: '/subjects' },
        { icon: Stethoscope, label: 'Clinical Skills', path: '/clinical-skills' },
        { icon: FlaskConical, label: 'Labs', path: '/labs' },
        { icon: ClipboardList, label: 'OSCE Stations', path: '/osce' },
        { icon: Syringe, label: 'Treatment Protocols', path: '/treatment-protocols' },
      ]
    },
    {
      type: 'section',
      title: 'Study Tools',
      icon: Brain,
      defaultOpen: false,
      items: [
        { icon: Brain, label: 'Quizzes', path: '/quizzes' },
        { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
        { icon: TrendingUp, label: 'Spaced Repetition', path: '/spaced-repetition' },
        { icon: BookOpen, label: 'Books', path: '/books' },
        { icon: FileText, label: 'Past Papers', path: '/past-papers' },
        { icon: Image, label: 'Photo Library', path: '/photos' },
        { icon: FileText, label: 'Notes', path: '/notes' },
        { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
      ]
    },
    {
      type: 'section',
      title: 'AI Assistants',
      icon: Sparkles,
      defaultOpen: false,
      items: [
        { icon: Sparkles, label: 'AI Study Assistant', path: '/ai-study-assistant' },
        { icon: Zap, label: 'AI Quiz Generator', path: '/ai-quiz-generator' },
        { icon: Stethoscope, label: 'OSCE Coach', path: '/osce-coach' },
        { icon: FlaskConical, label: 'Case Generator', path: '/case-generator' },
        { icon: HelpCircle, label: 'AI Guide', path: '/ai-guide' },
      ]
    },
    {
      type: 'section',
      title: 'Progress & Analytics',
      icon: BarChart3,
      defaultOpen: false,
      items: [
        { icon: TrendingUp, label: 'Progress', path: '/progress' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Brain, label: 'AI Performance', path: '/performance' },
      ]
    },
    {
      type: 'section',
      title: 'Gamification',
      icon: Trophy,
      defaultOpen: false,
      items: [
        { icon: Trophy, label: 'Gamification', path: '/gamification' },
        { icon: Award, label: 'Achievements', path: '/achievements' },
        { icon: Target, label: 'Challenges', path: '/challenges' },
        { icon: BarChart3, label: 'Leaderboard', path: '/leaderboard' },
      ]
    },
    {
      type: 'section',
      title: 'Social',
      icon: UsersRound,
      defaultOpen: false,
      items: [
        { icon: MessageSquare, label: 'Discussions', path: '/discussions' },
        { icon: UsersRound, label: 'Study Groups', path: '/study-groups' },
        { icon: FileCheck, label: 'Peer Reviews', path: '/peer-reviews' },
        { icon: Share2, label: 'Shared Resources', path: '/shared-resources' },
      ]
    },
    {
      type: 'pinned',
      items: [
        { icon: Info, label: 'About', path: '/about' },
      ]
    }
  ]
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const userRole = getUserRole();

  // State for managing which sections are expanded
  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem('sidebarExpandedSections');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default: expand sections with defaultOpen: true
    const defaults = {};
    const menu = menuStructure[userRole] || menuStructure.student;
    menu.forEach((section, index) => {
      if (section.type === 'section' && section.defaultOpen) {
        defaults[index] = true;
      }
    });
    return defaults;
  });

  // Save expanded sections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sidebarExpandedSections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  // Toggle section expansion
  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Get menu structure based on user role
  const menu = menuStructure[userRole] || menuStructure.student;

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
        {/* Close button for mobile - floating outside */}
        <button
          onClick={onClose}
          className="lg:hidden absolute -right-12 top-4 z-50 w-10 h-10 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg border border-l-0 border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex flex-col h-full">
          {/* Menu items */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menu.map((section, sectionIndex) => {
              if (section.type === 'pinned') {
                // Render pinned items (always visible)
                return (
                  <div key={`pinned-${sectionIndex}`} className="space-y-1 mb-4">
                    {section.items.map((item) => {
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
                  </div>
                );
              }

              if (section.type === 'section') {
                // Render collapsible section
                const SectionIcon = section.icon;
                const isExpanded = expandedSections[sectionIndex];

                return (
                  <div key={`section-${sectionIndex}`} className="mb-2">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(sectionIndex)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <SectionIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {section.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>

                    {/* Section Items */}
                    {isExpanded && (
                      <div className="mt-1 ml-2 space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={onClose}
                              className={clsx(
                                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm',
                                isActive
                                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                              )}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
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

