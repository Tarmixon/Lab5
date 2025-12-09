import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import LessonCard from "../components/LessonCard";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// Константи для вибору
const LANGUAGES = ["English", "Spanish", "German", "French", "Ukrainian"];
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function Lessons() {
    const [lessons, setLessons] = useState([]);
    const [user, setUser] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    // Стан для нового уроку (додані language та level)
    const [newLesson, setNewLesson] = useState({
        title: "",
        description: "",
        video: "",
        language: "English", // значення за замовчуванням
        level: "A1"
    });

    // 👇 Стан для фільтрів
    const [filters, setFilters] = useState({
        language: "All",
        level: "All"
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) fetchCompletedLessons(user.uid);
        });
        return () => unsubscribe();
    }, []);

    const fetchCompletedLessons = async (userId) => {
        try {
            const res = await fetch(`/api/completed?userId=${userId}`);
            const data = await res.json();
            const completedIds = data.map(entry => entry.lessonId);
            setCompletedLessons(completedIds);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchLessons = async () => {
        const snapshot = await getDocs(collection(db, "lessons"));
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setLessons(data);
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    const handleComplete = async (lessonId) => {
        setCompletedLessons(prev => [...prev, lessonId]);
        await fetch("/api/completed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.uid, lessonId })
        });
    };

    const handleReset = async (lessonId) => {
        setCompletedLessons(prev => prev.filter(id => id !== lessonId));
        if (user) {
            try {
                await fetch(`/api/completed?userId=${user.uid}&lessonId=${lessonId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });
            } catch (error) {
                console.error("Error resetting:", error);
            }
        }
    };

    const handleInputChange = (e) => {
        setNewLesson({ ...newLesson, [e.target.name]: e.target.value });
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "lessons"), newLesson);
            // Скидаємо форму
            setNewLesson({ 
                title: "", description: "", video: "", 
                language: "English", level: "A1" 
            });
            setShowForm(false);
            fetchLessons();
        } catch (err) {
            console.error("Помилка додавання уроку:", err);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        try {
            await deleteDoc(doc(db, "lessons", lessonId));
            fetchLessons();
        } catch (err) {
            console.error("Помилка видалення уроку:", err);
        }
    };

    // 👇 ЛОГІКА ФІЛЬТРАЦІЇ
    const filteredLessons = lessons.filter(lesson => {
        const matchLang = filters.language === "All" || lesson.language === filters.language;
        const matchLevel = filters.level === "All" || lesson.level === filters.level;
        return matchLang && matchLevel;
    });

    return (
        <div className="page">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2>Уроки</h2>
                
                {/* 👇 БЛОК ФІЛЬТРІВ (Справа зверху) */}
                <div className="filters" style={{display: 'flex', gap: '10px'}}>
                    <select 
                        value={filters.language} 
                        onChange={(e) => setFilters({...filters, language: e.target.value})}
                    >
                        <option value="All">Всі мови</option>
                        {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>

                    <select 
                        value={filters.level} 
                        onChange={(e) => setFilters({...filters, level: e.target.value})}
                    >
                        <option value="All">Всі рівні</option>
                        {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                </div>
            </div>

            {user && (
                <>
                    <button onClick={() => setShowForm(!showForm)} style={{marginBottom: '20px'}}>
                        {showForm ? "Сховати форму" : "Створити урок"}
                    </button>

                    {showForm && (
                        <form onSubmit={handleAddLesson} style={{ 
                            marginBottom: "20px", padding: "15px", 
                            border: "1px solid #ccc", borderRadius: "8px" 
                        }}>
                            <input
                                type="text" name="title" placeholder="Назва уроку"
                                value={newLesson.title} onChange={handleInputChange} required
                            />
                            <textarea
                                name="description" placeholder="Опис"
                                value={newLesson.description} onChange={handleInputChange} required
                            />
                            <input
                                type="text" name="video" placeholder="YouTube URL"
                                value={newLesson.video} onChange={handleInputChange}
                            />
                            
                            {/* 👇 Нові поля у формі */}
                            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                                <select name="language" value={newLesson.language} onChange={handleInputChange}>
                                    {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                                </select>
                                <select name="level" value={newLesson.level} onChange={handleInputChange}>
                                    {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                </select>
                            </div>

                            <button type="submit" style={{marginTop: '10px'}}>Додати урок</button>
                        </form>
                    )}
                </>
            )}

            {/* 👇 Рендеримо ВІДФІЛЬТРОВАНИЙ список */}
            {filteredLessons.length > 0 ? (
                filteredLessons.map((lesson) => (
                    <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isCompleted={completedLessons.includes(lesson.id)}
                        onComplete={handleComplete}
                        onReset={handleReset}
                        onDelete={() => handleDeleteLesson(lesson.id)}
                        user={user}
                    />
                ))
            ) : (
                <p>Уроків за цими фільтрами не знайдено.</p>
            )}
        </div>
    );
}
