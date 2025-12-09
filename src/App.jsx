import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Lessons from './pages/Lessons';
import ProgressPage from './pages/ProgressPage';
import PracticePage from "./pages/PracticePage";
import ProfilePage from './pages/ProfilePage';
import LoginPage from "./pages/LoginPage";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <Router>
            <header>
                <h1>Language Learning Platform</h1>
                <nav>
                    <Link to="/">Lessons</Link>
                    <Link to="/progress">My Progress</Link>
                    <Link to="/practice">Practice</Link>

                    {user ? (
                        <>
                            <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="login-link">Login</Link>
                    )}
                </nav>
            </header>
            <Routes>
                <Route path="/" element={<Lessons />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
