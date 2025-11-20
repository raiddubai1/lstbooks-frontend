import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import {
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Video,
  FileText,
  ClipboardList
} from 'lucide-react';

const AIGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'getting-started', label: 'Getting Started', icon: Target },
    { id: 'features', label: 'Key Features', icon: Brain },
    { id: 'tips', label: 'Pro Tips', icon: Lightbulb },
    { id: 'examples', label: 'Examples', icon: MessageSquare },
    { id: 'performance', label: 'Track Progress', icon: TrendingUp }
  ];

  return (
    <div>
      <SectionHeader
        title="🤖 AI Study Assistant Guide"
        subtitle="Learn how to get the most out of your personalized AI tutor"
      />

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-500" />
                What Makes lstBooks AI Special?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Unlike generic AI assistants like ChatGPT or Gemini, lstBooks AI is specifically designed for dental education. 
                It knows your strengths, weaknesses, and learning patterns to provide personalized guidance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Personalized Learning</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  AI adapts to YOUR performance data, focusing on topics where you need improvement and celebrating your strengths.
                </p>
              </div>

              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Integrated Resources</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Get instant links to relevant quizzes, videos, flashcards, and OSCE stations right in your conversation.
                </p>
              </div>

              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Dental Expertise</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Specialized knowledge in dental anatomy, procedures, clinical cases, and exam preparation.
                </p>
              </div>

              <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  AI monitors your quiz scores, study time, and streaks to provide data-driven recommendations.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6">
              <h3 className="font-bold text-xl mb-2">Ready to Start?</h3>
              <p className="mb-4">Jump into a conversation with your AI Study Assistant now!</p>
              <Link
                to="/ai-study-assistant"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Getting Started Section */}
        {activeSection === 'getting-started' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-500" />
              Getting Started with AI Study Assistant
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Navigate to AI Study Assistant</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Click on "AI Study Assistant" in the sidebar or visit the AI Assistants section.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Start a New Session</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Click "New Session" and optionally select a subject, year, and topic to focus your conversation.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      💡 <strong>Tip:</strong> Selecting a subject helps AI provide more relevant resources!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Ask Your Question</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Type your question in the chat box. Be specific for better answers!
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mt-2">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      ✅ <strong>Good:</strong> "Explain the stages of periodontal disease and their clinical features"
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mt-2">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      ❌ <strong>Avoid:</strong> "Tell me about teeth"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Explore Recommended Resources</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    AI will suggest quizzes, videos, and flashcards. Click the blue resource cards to access them instantly!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Track Your Progress</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Visit the "AI Performance" page to see your weak areas, strong areas, and personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-500" />
              Key Features
            </h2>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  📊 Performance-Based Personalization
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  The AI knows your quiz scores, weak areas, and strong areas. It automatically:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Focuses explanations on topics where you scored below 60%</li>
                  <li>Provides extra practice resources for weak areas</li>
                  <li>Acknowledges and builds on your strengths</li>
                  <li>Adapts difficulty level based on your performance</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  🔗 Smart Resource Recommendations
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  AI suggests relevant platform content based on your conversation:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ClipboardList className="w-5 h-5 text-blue-500" />
                    <span>Quizzes for practice</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Video className="w-5 h-5 text-red-500" />
                    <span>Educational videos</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    <span>Flashcards for memorization</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FileText className="w-5 h-5 text-purple-500" />
                    <span>Clinical skills & OSCE</span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  🎯 Specialized Dental Knowledge
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  AI is trained specifically for dental education and can help with:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Dental anatomy and terminology</li>
                  <li>Clinical procedures and techniques</li>
                  <li>Diagnosis and treatment planning</li>
                  <li>Exam preparation and study strategies</li>
                  <li>OSCE scenarios and patient communication</li>
                </ul>
              </div>

              {/* Feature 4 */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  📈 Continuous Learning & Adaptation
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Every quiz you take updates your performance profile. The AI gets smarter about your needs over time,
                  providing increasingly personalized guidance as you progress through your studies.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pro Tips Section */}
        {activeSection === 'tips' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Pro Tips for Maximum Learning
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">💬 Ask Follow-Up Questions</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Don't hesitate to ask "Can you explain that differently?" or "Give me an example" if something isn't clear.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">📝 Take Quizzes Regularly</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  The more quizzes you take, the better AI understands your learning needs and provides personalized help.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">🎯 Set Study Goals</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Use the Study Goals feature on your dashboard to set targets and track progress. AI will help you achieve them!
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">🔗 Click Resource Links</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  When AI suggests quizzes or videos, click them! They're specifically chosen to help you improve.
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">⚠️ Focus on Weak Areas</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Check your AI Performance page regularly to identify weak areas and ask AI for targeted help on those topics.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">🔥 Maintain Your Streak</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Study daily to build your streak! AI tracks this and celebrates your consistency.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Examples Section */}
        {activeSection === 'examples' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              Example Conversations
            </h2>

            <div className="space-y-6">
              {/* Example 1 */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white">Example 1: Asking for Explanation</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">You:</p>
                    <p className="text-gray-700 dark:text-gray-300">"Can you explain the difference between gingivitis and periodontitis?"</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">AI:</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      "Great question! I notice you've been working on Periodontology (scored 65% last time). Let me help you master this...
                      <br/><br/>
                      <strong>Gingivitis:</strong> Inflammation of the gums only, reversible...<br/>
                      <strong>Periodontitis:</strong> Inflammation extends to supporting structures...<br/><br/>
                      📚 <strong>Want to practice?</strong><br/>
                      • [Quiz: Periodontal Disease Classification](/quizzes/123)<br/>
                      • [Video: Clinical Features of Periodontitis](/videos/456)"
                    </p>
                  </div>
                </div>
              </div>

              {/* Example 2 */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white">Example 2: Exam Preparation</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">You:</p>
                    <p className="text-gray-700 dark:text-gray-300">"I have an exam on dental anatomy next week. What should I focus on?"</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">AI:</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      "Based on your performance, I recommend focusing on:<br/><br/>
                      ⚠️ <strong>Weak Areas:</strong><br/>
                      • Tooth numbering systems (45% score)<br/>
                      • Root canal anatomy (52% score)<br/><br/>
                      ✅ <strong>Strong Areas:</strong><br/>
                      • Crown anatomy (88% score) - just review briefly<br/><br/>
                      📚 <strong>Study Plan:</strong><br/>
                      • [Quiz: Tooth Numbering Practice](/quizzes/789)<br/>
                      • [Flashcards: Root Canal Anatomy](/flashcards/101)"
                    </p>
                  </div>
                </div>
              </div>

              {/* Example 3 */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white">Example 3: Clinical Scenario</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">You:</p>
                    <p className="text-gray-700 dark:text-gray-300">"How do I perform a proper dental examination?"</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">AI:</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      "Excellent question! Here's a systematic approach...<br/><br/>
                      1. <strong>Extra-oral examination:</strong> Face, TMJ, lymph nodes...<br/>
                      2. <strong>Intra-oral examination:</strong> Soft tissues, hard tissues...<br/><br/>
                      🎯 <strong>Practice Resources:</strong><br/>
                      • [OSCE Station: Dental Examination](/osce/234)<br/>
                      • [Skill: Clinical Examination Technique](/skills/567)<br/>
                      • [Video: Step-by-Step Examination](/videos/890)"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Section */}
        {activeSection === 'performance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              Track Your Progress
            </h2>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 mb-6">
              <h3 className="font-bold text-xl mb-2">Your AI Performance Dashboard</h3>
              <p className="mb-4">
                Visit your AI Performance page to see detailed analytics and get personalized recommendations.
              </p>
              <Link
                to="/performance"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Performance
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">📊 What You'll See</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li><strong>Overall Stats:</strong> Total quizzes, average score, study time, current streak</li>
                  <li><strong>Weak Areas:</strong> Topics where you scored below 60% (needs improvement)</li>
                  <li><strong>Strong Areas:</strong> Topics where you scored above 80% (mastered!)</li>
                  <li><strong>Topic Performance:</strong> Detailed breakdown with trends (improving/declining/stable)</li>
                  <li><strong>AI Recommendations:</strong> Personalized study suggestions based on your data</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">🎯 How AI Uses This Data</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Every time you chat with AI, it considers your performance data to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Provide extra detail on topics where you're weak</li>
                  <li>Suggest practice resources for areas needing improvement</li>
                  <li>Adjust explanation difficulty to match your level</li>
                  <li>Celebrate your achievements and strong areas</li>
                  <li>Create personalized study plans</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">📈 Improving Your Performance</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>1. Take Regular Quizzes:</strong> More data = better AI personalization</p>
                  <p><strong>2. Focus on Weak Areas:</strong> Use AI to get targeted help on low-scoring topics</p>
                  <p><strong>3. Review Strong Areas:</strong> Maintain your mastery with periodic review</p>
                  <p><strong>4. Set Study Goals:</strong> Use the Study Goals widget on your dashboard</p>
                  <p><strong>5. Maintain Streaks:</strong> Study daily to build momentum and habits</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-yellow-900 dark:text-yellow-300 mb-1">Privacy Note</h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Your performance data is private and only used to personalize your learning experience.
                      It's never shared with other students or used for any other purpose.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGuide;

