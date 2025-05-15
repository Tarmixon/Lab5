import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import LessonCard from "../components/LessonCard";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Lessons() {
    const [lessons, setLessons] = useState([]);
    const [user, setUser] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newLesson, setNewLesson] = useState({
        title: "",
        description: "",
        video: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) fetchCompletedLessons(user.uid);
        });
        return () => unsubscribe();
    }, []);

    const fetchCompletedLessons = async (userId) => {
        const res = await fetch(`http://localhost:5000/api/completed?userId=${userId}`);
        const data = await res.json();
        const completedIds = data.map(entry => entry.lessonId);
        setCompletedLessons(completedIds);
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

        await fetch("http://localhost:5000/api/completed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.uid,
                lessonId: lessonId
            })
        });
    };

    const handleReset = (lessonId) => {
        setCompletedLessons(prev => prev.filter(id => id !== lessonId));
        // (необов’язково) DELETE-запит на сервер
    };

    const handleInputChange = (e) => {
        setNewLesson({ ...newLesson, [e.target.name]: e.target.value });
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "lessons"), newLesson);
            setNewLesson({ title: "", description: "", video: "" });
            setShowForm(false);
            fetchLessons(); // оновити список уроків після додавання
        } catch (err) {
            console.error("Помилка додавання уроку:", err);
        }
    };

    // Функція видалення уроку з Firestore:
    const handleDeleteLesson = async (lessonId) => {
        try {
            await deleteDoc(doc(db, "lessons", lessonId));
            fetchLessons(); // оновити список після видалення
        } catch (err) {
            console.error("Помилка видалення уроку:", err);
        }
    };

    return (
        <div className="page">
            <h2>Уроки</h2>
            {user && (
                <>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Сховати форму" : "Створити урок"}
                    </button>

                    {showForm && (
                        <form onSubmit={handleAddLesson} style={{ marginTop: "10px" }}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Назва уроку"
                                value={newLesson.title}
                                onChange={handleInputChange}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Опис"
                                value={newLesson.description}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="video"
                                placeholder="YouTube URL"
                                value={newLesson.video}
                                onChange={handleInputChange}
                            />
                            <button type="submit">Додати</button>
                        </form>
                    )}
                </>
            )}
            {lessons.map((lesson) => (
                <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={completedLessons.includes(lesson.id)}
                    onComplete={handleComplete}
                    onReset={handleReset}
                    onDelete={() => handleDeleteLesson(lesson.id)} // передаємо функцію видалення
                    user={user}
                />
            ))}
        </div>
    );
}
