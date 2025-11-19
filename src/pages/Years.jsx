import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Video, FileText, Users, Award, FlaskConical, Stethoscope, Brain } from 'lucide-react';

const Years = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/years`);
      setYears(response.data);
    } catch (error) {
      console.error('Error fetching years:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYearColor = (order) => {
    const colors = [
      'from-purple-500 to-pink-500',    // Foundation
      'from-blue-500 to-cyan-500',      // Year 1
      'from-green-500 to-emerald-500',  // Year 2
      'from-yellow-500 to-orange-500',  // Year 3
      'from-red-500 to-rose-500',       // Year 4
      'from-indigo-500 to-purple-500'   // Year 5
    ];
    return colors[order] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Academic Years
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose your year to access subjects, resources, and study materials
          </p>
        </div>

        {/* Years Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {years.map((year) => (
            <div
              key={year._id}
              onClick={() => navigate(`/years/${year._id}`)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl">
                {/* Gradient Header */}
                <div className={`h-32 bg-gradient-to-r ${getYearColor(year.order)} p-6 flex items-center justify-center`}>
                  <h2 className="text-3xl font-bold text-white">
                    {year.displayName}
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                    {year.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Subjects</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {year.stats?.totalSubjects || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Quizzes</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {year.stats?.totalQuizzes || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Flashcards</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {year.stats?.totalFlashcards || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FlaskConical className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Labs</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {year.stats?.totalLabs || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Video className="w-4 h-4" />
                        <span>{year.resources?.videoSummaries?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{year.resources?.pdfNotes?.length || 0}</span>
                      </div>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Years;

