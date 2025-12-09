import React from 'react';

const LessonCard = ({ lesson, onComplete, onReset, isCompleted, user, onDelete }) => {
    
    // Ми прибрали звідси fetch, бо він вже є в Lessons.jsx
    // Ми прибрали deleteDoc, бо він вже є в Lessons.jsx

    const handleDelete = () => {
        if (window.confirm(`Ви впевнені, що хочете видалити урок "${lesson.title}"?`)) {
            onDelete(); // Викликаємо функцію батька, яка все зробить
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
                        // Просто викликаємо функцію, яку передав батько (Lessons.jsx)
                        onClick={() => onComplete(lesson.id)} 
                        disabled={isCompleted}
                    >
                        {isCompleted ? 'Виконано' : 'Позначити як виконаний'}
                    </button>
                    
                    {isCompleted && (
                        <button 
                            onClick={() => onReset(lesson.id)} // Викликаємо батьківську функцію
                            style={{ marginLeft: '10px', backgroundColor: 'red' }}
                        >
                            Скасувати
                        </button>
                    )}
                    
                    <button 
                        onClick={handleDelete} 
                        style={{ marginLeft: '10px', backgroundColor: 'gray' }}
                    >
                        Видалити
                    </button>
                </>
            )}
        </div>
    );
};

export default LessonCard;
