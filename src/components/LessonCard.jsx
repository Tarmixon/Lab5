import React from 'react';

const LessonCard = ({ lesson, onComplete, onReset, isCompleted, user, onDelete }) => {
    
    const getEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return null;
    };

    const embedUrl = getEmbedUrl(lesson.video);

    const handleDelete = () => {
        if (window.confirm(`Ви впевнені, що хочете видалити урок "${lesson.title}"?`)) {
            onDelete(); 
        }
    };

    return (
        <div className={`card ${isCompleted ? 'completed' : ''}`} style={{ position: 'relative' }}>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {lesson.language && (
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {lesson.language}
                    </span>
                )}
                {lesson.level && (
                    <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {lesson.level}
                    </span>
                )}
            </div>

            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            
            {embedUrl ? (
                <iframe
                    width="100%"
                    height="200"
                    src={embedUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: '12px' }}
                />
            ) : (
                <div style={{ height: "200px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", marginBottom: "10px", color: "#888", fontSize: "0.9rem" }}>
                    {lesson.video && lesson.video.trim() !== "" ? "⚠️ Невірне посилання" : "🎥 Відео відсутнє"}
                </div>
            )}

            {user && (
                // 👇 ОНОВЛЕНИЙ КОНТЕЙНЕР КНОПОК
                // Ми прибрали inline-стилі і додали клас lesson-card-actions
                <div className="lesson-card-actions">
                    <button
                        style={{ backgroundColor: isCompleted ? 'green' : '#4F46E5' }}
                        onClick={() => onComplete(lesson.id)} 
                        disabled={isCompleted}
                    >
                        {isCompleted ? 'Виконано' : 'Позначити як виконаний'}
                    </button>
                    
                    {isCompleted && (
                        // 👇 Прибрано marginLeft
                        <button 
                            onClick={() => onReset(lesson.id)} 
                            style={{ backgroundColor: 'red' }}
                        >
                            Скасувати
                        </button>
                    )}
                    
                    {/* 👇 Прибрано marginLeft */}
                    <button 
                        onClick={handleDelete} 
                        style={{ backgroundColor: 'gray' }}
                    >
                        Видалити
                    </button>
                </div>
            )}
        </div>
    );
};

export default LessonCard;
