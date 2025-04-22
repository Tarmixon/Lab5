import React from 'react';

const LessonCard = ({ lesson, onComplete, onReset, isCompleted }) => {
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
            <button
                style={{ backgroundColor: isCompleted ? 'green' : '#4F46E5' }}
                onClick={() => onComplete(lesson.id)}
            >
                {isCompleted ? 'Виконано' : 'Позначити як виконаний'}
            </button>
            {isCompleted && <button onClick={() => onReset(lesson.id)}>Скасувати</button>}
        </div>
    );
};

export default LessonCard;
