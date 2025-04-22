import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Lessons from './pages/Lessons';
import Practice from './pages/Practice';
import ProgressPage from './pages/ProgressPage';
import './App.css';

function App() {
  return (
      <Router>
        <header>
          <h1>Language Learning Platform</h1>
          <nav>
            <Link to="/">Lessons</Link>
            <Link to="/progress">My Progress</Link>
            <Link to="/practice">Practice</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Lessons />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </Router>
  );
}

export default App;
