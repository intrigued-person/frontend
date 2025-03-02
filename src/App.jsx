import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import './App.css';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/sign" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;