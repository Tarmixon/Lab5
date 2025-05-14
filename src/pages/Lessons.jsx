import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import LessonCard from "../components/LessonCard";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Lessons() {
    const [lessons, setLessons] = useState([]);
    const [user, setUser] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);

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

    useEffect(() => {
        const fetchLessons = async () => {
            const snapshot = await getDocs(collection(db, "lessons"));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLessons(data);
        };
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
        // (необов’язково) Запит DELETE на бекенд
    };

    return (
        <div className="page">
            <h2>Уроки</h2>
            {lessons.map((lesson) => (
                <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={completedLessons.includes(lesson.id)}
                    onComplete={handleComplete}
                    onReset={handleReset}
                    user={user}
                />
            ))}
        </div>
    );
}
