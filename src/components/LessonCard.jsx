import React from 'react';

const LessonCard = ({ lesson, onComplete, onReset, isCompleted, user, onDelete }) => {
    
    // Функція для отримання правильного посилання для iframe
    const getEmbedUrl = (url) => {
        if (!url) return null;
        
        // Регулярний вираз для пошуку ID відео YouTube
        // Підтримує формати: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        // Якщо ID знайдено і він має 11 символів (стандарт YouTube)
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        
        return null; // Якщо це не YouTube або посилання бите
    };

    const embedUrl = getEmbedUrl(lesson.video);

    const handleDelete = () => {
        if (window.confirm(`Ви впевнені, що хочете видалити урок "${lesson.title}"?`)) {
            onDelete(); 
        }
    };

    return (
        <div className={`card ${isCompleted ? 'completed' : ''}`}>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            
            {/* Логіка відображення відео */}
            {embedUrl ? (
                <iframe
                    width="100%"
                    height="200"
                    src={embedUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                // Заглушка, якщо відео немає або посилання криве
                <div style={{ 
                    height: "200px", 
                    backgroundColor: "#f0f0f0", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    color: "#888",
                    fontSize: "0.9rem"
                }}>
                    {lesson.video && lesson.video.trim() !== "" 
                        ? "⚠️ Невірне посилання на відео" 
                        : "🎥 Відео відсутнє"}
                </div>
            )}

            {user && (
                <div style={{ marginTop: '10px' }}>
                    <button
                        style={{ backgroundColor: isCompleted ? 'green' : '#4F46E5' }}
                        onClick={() => onComplete(lesson.id)} 
                        disabled={isCompleted}
                    >
                        {isCompleted ? 'Виконано' : 'Позначити як виконаний'}
                    </button>
                    
                    {isCompleted && (
                        <button 
                            onClick={() => onReset(lesson.id)} 
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
                </div>
            )}
        </div>
    );
};

export default LessonCard;
