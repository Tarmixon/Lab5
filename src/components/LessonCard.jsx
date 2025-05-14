import React from 'react';

const LessonCard = ({ lesson, onComplete, onReset, isCompleted, user }) => {
    const handleComplete = async () => {
        onComplete(lesson.id); // локальне оновлення стану

        try {
            const response = await fetch("http://localhost:5000/api/completed", {
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
                </>
            )}
        </div>
    );
};

export default LessonCard;
