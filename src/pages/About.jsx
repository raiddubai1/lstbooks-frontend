import { Mail, Phone, MapPin, Users, Target, Heart, BookOpen, Award } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const About = () => {
  return (
    <div className="min-h-screen">
      <SectionHeader
        title="About lstBooks"
        subtitle="Empowering dental students with comprehensive learning resources"
      />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Mission Section */}
        <div className="card">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                lstBooks is dedicated to providing dental students with a comprehensive, accessible, and 
                interactive learning platform. We believe that quality education should be available to 
                every aspiring dental professional, helping them master the knowledge and skills needed 
                to excel in their careers and provide exceptional patient care.
              </p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">Comprehensive Subjects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  8 major dental specialties with detailed resources and study materials
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">Interactive Quizzes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Test your knowledge with authentic dental questions and instant feedback
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">Clinical Skills Training</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Step-by-step guides for essential dental procedures and techniques
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">OSCE Preparation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Practice stations to prepare for clinical examinations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">Flashcards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active recall learning with 3D flip animations and study modes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">Lab Manuals</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detailed laboratory procedures with step-by-step instructions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-3">
            <Heart className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Excellence</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We strive for the highest quality in educational content and user experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Accessibility</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Making quality dental education accessible to students everywhere
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Innovation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continuously improving our platform with modern learning technologies
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-3">
            <Mail className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Have questions, feedback, or need support? We'd love to hear from you!
            Reach out to us through any of the following channels:
          </p>

          <div className="space-y-4">
            {/* Email - General Inquiries */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">General Inquiries</h3>
                <a
                  href="mailto:info@lstbooks.com"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  info@lstbooks.com
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  For general questions, feedback, and information about our platform
                </p>
              </div>
            </div>

            {/* Email - Admin/Support */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">Technical Support & Administration</h3>
                <a
                  href="mailto:admin@lstbooks.com"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  admin@lstbooks.com
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  For technical issues, account problems, and administrative matters
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 dark:text-white">Phone Support</h3>
                <a
                  href="tel:+971595953088"
                  className="text-primary-600 dark:text-primary-400 hover:underline text-lg font-mono"
                >
                  +971 59 595 3088
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Available for urgent inquiries and direct assistance
                </p>
              </div>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Response Time:</strong> We typically respond to all inquiries within 24-48 hours.
              For urgent matters, please call our phone support line.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for choosing lstBooks as your dental education partner.
            Together, we're building the future of dental education! 🦷
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

