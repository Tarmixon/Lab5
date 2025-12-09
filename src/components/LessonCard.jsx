import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // переконайся, що шлях до firebase.js правильний

const LessonCard = ({ lesson, onComplete, onReset, isCompleted, user, onDelete }) => {
    const handleComplete = async () => {
        onComplete(lesson.id); // локальне оновлення стану

        try {
            const response = await fetch("/api/completed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.uid,
                    lessonId: lesson.id
                })
            });
            const data = await response.json();
            console.log("✅ Позначено як виконаний:", data);
        } catch (err) {
            console.error("❌ Помилка збереження на сервері:", err);
        }
    };

    const handleReset = () => {
        onReset(lesson.id);
    };

    const handleDelete = async () => {
        if (window.confirm(`Ви впевнені, що хочете видалити урок "${lesson.title}"?`)) {
            try {
                await deleteDoc(doc(db, "lessons", lesson.id));
                console.log("🗑️ Урок видалено");
                onDelete(); // оновити список після видалення
            } catch (error) {
                console.error("❌ Помилка видалення уроку:", error);
            }
        }
    };

    return (
        <div className={`card ${isCompleted ? 'completed' : ''}`}>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <iframe
                width="100%"
                height="200"
                src={lesson.video}
                title={lesson.title}
                frameBorder="0"
                allowFullScreen
            />
            {user && (
                <>
                    <button
                        style={{ backgroundColor: isCompleted ? 'green' : '#4F46E5' }}
                        onClick={handleComplete}
                        disabled={isCompleted}
                    >
                        {isCompleted ? 'Виконано' : 'Позначити як виконаний'}
                    </button>
                    {isCompleted && (
                        <button onClick={handleReset} style={{ marginLeft: '10px', backgroundColor: 'red' }}>
                            Скасувати
                        </button>
                    )}
                    <button onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'gray' }}>
                        Видалити
                    </button>
                </>
            )}
        </div>
    );
};

export default LessonCard;
