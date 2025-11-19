import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Years from './pages/Years';
import YearDetail from './pages/YearDetail';
import Progress from './pages/Progress';
import Analytics from './pages/Analytics';
import Notes from './pages/Notes';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import ClinicalSkills from './pages/ClinicalSkills';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
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
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider>
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
            <Route path="clinical-skills" element={<ClinicalSkills />} />
            <Route path="skills" element={<Skills />} />
            <Route path="skills/:id" element={<SkillDetail />} />
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notes" element={<Notes />} />
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

