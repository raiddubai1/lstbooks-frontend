import { Link } from 'react-router-dom';
import {
  BookOpen,
  Brain,
  FlaskConical,
  ClipboardList,
  ArrowRight,
  TrendingUp,
  Sparkles,
  FileText,
  Image,
  Calendar,
  Stethoscope,
  FolderOpen,
  Zap,
  Users,
  Award,
  Clock,
  CheckCircle,
  Star,
  BookMarked,
  GraduationCap,
  Target,
  Lightbulb
} from 'lucide-react';

const Home = () => {
  const mainFeatures = [
    {
      icon: BookOpen,
      title: 'Digital Library',
      description: 'Access thousands of dental books, past papers, and study materials',
      link: '/books',
      color: 'from-blue-500 to-blue-600',
      stats: '1000+ Resources'
    },
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Generate custom quizzes and flashcards instantly with AI',
      link: '/ai-quiz-generator',
      color: 'from-purple-500 to-pink-500',
      stats: 'Unlimited Generation',
      badge: 'AI'
    },
    {
      icon: Calendar,
      title: 'Course Planner',
      description: 'Organize your study schedule and track your progress',
      link: '/course-planner',
      color: 'from-green-500 to-emerald-600',
      stats: 'Smart Planning'
    },
    {
      icon: Stethoscope,
      title: 'Treatment Protocols',
      description: 'Step-by-step clinical procedures and treatment guidelines',
      link: '/treatment-protocols',
      color: 'from-red-500 to-rose-600',
      stats: '200+ Protocols'
    },
    {
      icon: Image,
      title: 'Photo Library',
      description: 'Extensive collection of clinical photos and radiographs',
      link: '/photo-library',
      color: 'from-orange-500 to-amber-600',
      stats: '5000+ Images'
    },
    {
      icon: Zap,
      title: 'Spaced Repetition',
      description: 'Master concepts with scientifically-proven learning technique',
      link: '/spaced-repetition',
      color: 'from-cyan-500 to-blue-600',
      stats: 'Smart Learning'
    }
  ];

  const aiTools = [
    {
      icon: Sparkles,
      title: 'AI Quiz Generator',
      description: 'Create custom quizzes on any topic instantly',
      link: '/ai-quiz-generator'
    },
    {
      icon: Brain,
      title: 'AI Flashcard Generator',
      description: 'Generate flashcards from your notes or PDFs',
      link: '/ai-flashcard-generator'
    },
    {
      icon: Lightbulb,
      title: 'AI Study Assistant',
      description: 'Get instant answers to your dental questions',
      link: '/ai-study-assistant'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 rounded-3xl p-8 md:p-16 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Dental Education Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Master Dentistry with
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Smart Learning Tools
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Your all-in-one platform for dental education. Access thousands of resources, AI-powered study tools, and master every concept with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/books"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <BookOpen className="w-5 h-5" />
              Explore Library
            </Link>
            <Link
              to="/ai-quiz-generator"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-5 h-5" />
              Try AI Tools
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">1000+</div>
              <div className="text-blue-100 text-sm">Study Resources</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
              <div className="text-blue-100 text-sm">Past Papers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">5000+</div>
              <div className="text-blue-100 text-sm">Clinical Photos</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">AI</div>
              <div className="text-blue-100 text-sm">Powered Tools</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Highlight */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">AI-POWERED</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            Study Smarter with AI
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate unlimited quizzes, flashcards, and get instant answers - all powered by advanced AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {aiTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                to={tool.link}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-2xl transition-all hover:scale-105 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2 dark:text-white">{tool.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:gap-2 transition-all">
                  Try Now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Features */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive tools and resources designed specifically for dental students
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className="card hover:shadow-xl transition-all hover:scale-105 group relative overflow-hidden"
              >
                {feature.badge && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {feature.badge}
                  </div>
                )}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{feature.stats}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Why Choose lstBooks */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            Why Dental Students Love lstBooks
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of students who are mastering dentistry with our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">Save Time</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Everything in one place - no more searching across multiple platforms
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">Study Smarter</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI-powered tools help you focus on what matters most
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">Ace Your Exams</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Practice with real past papers and AI-generated quizzes
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">Join Community</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Learn alongside thousands of dental students worldwide
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start your journey to dental excellence today
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-xl mb-3 dark:text-white">Browse Resources</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Explore our extensive library of books, papers, photos, and protocols
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-xl mb-3 dark:text-white">Use AI Tools</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate custom quizzes and flashcards tailored to your study needs
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-xl mb-3 dark:text-white">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your learning journey and master every concept with confidence
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-3xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Study Experience?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join lstBooks today and access everything you need to succeed in dental school
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/books"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2 justify-center"
          >
            <BookOpen className="w-5 h-5" />
            Start Learning Now
          </Link>
          <Link
            to="/dashboard"
            className="bg-blue-500/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500/30 transition-all inline-flex items-center gap-2 justify-center"
          >
            <TrendingUp className="w-5 h-5" />
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

