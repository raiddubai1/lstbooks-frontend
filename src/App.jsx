import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import OfflineIndicator from './components/OfflineIndicator';
import InstallPrompt from './components/InstallPrompt';
import { registerServiceWorker } from './utils/pwa';
import { initDB } from './utils/offlineStorage';
import Home from './pages/Home';
import Years from './pages/Years';
import YearDetail from './pages/YearDetail';
import PerformanceAnalytics from './pages/PerformanceAnalytics';
import Notes from './pages/Notes';
import Bookmarks from './pages/Bookmarks';
import Reminders from './pages/Reminders';
import AIStudyAssistant from './pages/AIStudyAssistant';
import OSCECoach from './pages/OSCECoach';
import CaseGenerator from './pages/CaseGenerator';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import Labs from './pages/Labs';
import LabDetail from './pages/LabDetail';
import OSCE from './pages/OSCE';
import OSCEDetail from './pages/OSCEDetail';
import Quizzes from './pages/Quizzes';
import QuizDetail from './pages/QuizDetail';
import QuizTake from './pages/QuizTake';
import QuizTakeAdvanced from './pages/QuizTakeAdvanced';
import QuizResults from './pages/QuizResults';
import Flashcards from './pages/Flashcards';
import FlashcardStudy from './pages/FlashcardStudy';
import Books from './pages/Books';
import PastPapers from './pages/PastPapers';
import PhotoLibrary from './pages/PhotoLibrary';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import About from './pages/About';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminContent from './pages/AdminContent';
import AdminUsers from './pages/AdminUsers';
import StudentAnalytics from './pages/StudentAnalytics';
import StudentDetail from './pages/StudentDetail';
import CoursePlanner from './pages/CoursePlanner';
import TreatmentProtocols from './pages/TreatmentProtocols';
import AIQuizGenerator from './pages/AIQuizGenerator';
import AIFlashcardGenerator from './pages/AIFlashcardGenerator';
import SpacedRepetition from './pages/SpacedRepetition';

function App() {
  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();

    // Initialize offline database
    initDB().catch(console.error);
  }, []);

  return (
    <ThemeProvider>
      <OfflineIndicator />
      <InstallPrompt />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="years" element={<Years />} />
            <Route path="years/:id" element={<YearDetail />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="subjects/:id" element={<SubjectDetail />} />
            <Route path="labs" element={<Labs />} />
            <Route path="labs/:id" element={<LabDetail />} />
            <Route path="osce" element={<OSCE />} />
            <Route path="osce/:id" element={<OSCEDetail />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="quizzes/:id" element={<QuizDetail />} />
            <Route path="quizzes/:id/take" element={<QuizTakeAdvanced />} />
            <Route path="quizzes/:id/results/:attemptId" element={<QuizResults />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="flashcards/study" element={<FlashcardStudy />} />
            <Route path="books" element={<Books />} />
            <Route path="past-papers" element={<PastPapers />} />
            <Route path="photos" element={<PhotoLibrary />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="performance" element={<PerformanceAnalytics />} />
            <Route path="notes" element={<Notes />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="ai-study-assistant" element={<AIStudyAssistant />} />
            <Route path="osce-coach" element={<OSCECoach />} />
            <Route path="case-generator" element={<CaseGenerator />} />
            <Route path="admin/analytics" element={<AdminAnalytics />} />
            <Route path="admin/content" element={<AdminContent />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="student-analytics" element={<StudentAnalytics />} />
            <Route path="student-analytics/:studentId" element={<StudentDetail />} />
            <Route path="course-planner" element={<CoursePlanner />} />
            <Route path="treatment-protocols" element={<TreatmentProtocols />} />
            <Route path="ai-quiz-generator" element={<AIQuizGenerator />} />
            <Route path="ai-flashcard-generator" element={<AIFlashcardGenerator />} />
            <Route path="spaced-repetition" element={<SpacedRepetition />} />
            <Route path="search" element={<Search />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

