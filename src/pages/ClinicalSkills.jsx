import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { Stethoscope, ClipboardList, FlaskConical, BookOpen } from 'lucide-react';

const ClinicalSkills = () => {
  const categories = [
    {
      title: 'Clinical Skills',
      description: 'Master essential dental techniques',
      icon: Stethoscope,
      link: '/skills',
      color: 'bg-blue-500',
      count: 'View all skills'
    },
    {
      title: 'OSCE Stations',
      description: 'Practice clinical examination scenarios',
      icon: ClipboardList,
      link: '/osce',
      color: 'bg-red-500',
      count: '15+ stations'
    },
    {
      title: 'Lab Procedures',
      description: 'Step-by-step laboratory guides',
      icon: FlaskConical,
      link: '/labs',
      color: 'bg-green-500',
      count: '20+ procedures'
    },
    {
      title: 'Study Guides',
      description: 'Comprehensive clinical guides',
      icon: BookOpen,
      link: '/subjects',
      color: 'bg-purple-500',
      count: '5+ subjects'
    }
  ];

  return (
    <div>
      <SectionHeader
        title="Clinical Skills"
        subtitle="Master practical dental procedures and examinations"
      />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.title}
              to={category.link}
              className="card hover:scale-105 transition-transform"
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  <span className="text-sm text-primary-600 font-medium">{category.count}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Featured Content */}
      <div className="card bg-gradient-to-br from-primary-50 to-purple-50 border-primary-100">
        <h2 className="text-2xl font-bold mb-4">Clinical Skills Development</h2>
        <p className="text-gray-700 mb-6">
          Develop your clinical competence through structured practice and assessment. 
          Our platform provides comprehensive resources for OSCE preparation, laboratory 
          procedures, and clinical case studies.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📋 OSCE Prep</h3>
            <p className="text-sm text-gray-600">
              Practice with realistic clinical scenarios and assessment checklists
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🔬 Lab Skills</h3>
            <p className="text-sm text-gray-600">
              Master laboratory techniques with detailed step-by-step guides
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">✅ Self-Assessment</h3>
            <p className="text-sm text-gray-600">
              Track your progress and identify areas for improvement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalSkills;

