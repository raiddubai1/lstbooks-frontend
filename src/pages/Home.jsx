import { Link } from 'react-router-dom';
import { BookOpen, Brain, FlaskConical, ClipboardList, ArrowRight, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Subjects',
      description: 'Access detailed study materials for all dental subjects',
      link: '/subjects',
      color: 'bg-blue-500'
    },
    {
      icon: Brain,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with practice quizzes',
      link: '/quizzes',
      color: 'bg-purple-500'
    },
    {
      icon: FlaskConical,
      title: 'Lab Manuals',
      description: 'Step-by-step guides for laboratory procedures',
      link: '/labs',
      color: 'bg-green-500'
    },
    {
      icon: ClipboardList,
      title: 'OSCE Preparation',
      description: 'Practice clinical scenarios and examinations',
      link: '/osce',
      color: 'bg-red-500'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-12 text-white mb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to lstBooks
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Your comprehensive learning platform for dental education. Study smarter, not harder.
          </p>
          <div className="flex gap-4">
            <Link to="/subjects" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Browse Subjects
            </Link>
            <Link to="/dashboard" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Explore Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className="card hover:scale-105 transition-transform"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-100 dark:border-primary-800">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-bold dark:text-white">Your Progress</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">5</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Subjects Enrolled</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">12</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes Completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">85%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">24h</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
          </div>
        </div>
        <Link to="/dashboard" className="mt-6 inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
          View detailed analytics <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default Home;

