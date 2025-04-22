import React, { useEffect, useState } from 'react';
import LessonCard from '../components/LessonCard';

const allLessons = [
    { id: 1, title: 'Basic Greetings', description: 'Learn how to greet people.', video: 'https://www.youtube.com/embed/FU684aR1iZ0', level: 'A1' },
    { id: 2, title: 'Ordering Food', description: 'How to order food.', video: 'https://www.youtube.com/embed/KTkXjkz18bw', level: 'A2' },
    { id: 3, title: 'Travel Phrases', description: 'Phrases for travel.', video: 'https://www.youtube.com/embed/j59nxoSLr4U', level: 'B1' }
];

const Lessons = () => {
    const [completedLessons, setCompletedLessons] = useState(() => {
        return JSON.parse(localStorage.getItem('completedLessons')) || [];
    });

    const [filter, setFilter] = useState('all');

    const handleComplete = (id) => {
        const updated = [...completedLessons, id];
        setCompletedLessons(updated);
        localStorage.setItem('completedLessons', JSON.stringify(updated));
    };

    const handleReset = (id) => {
        const updated = completedLessons.filter(l => l !== id);
        setCompletedLessons(updated);
        localStorage.setItem('completedLessons', JSON.stringify(updated));
    };

    const filteredLessons = filter === 'all'
        ? allLessons
        : allLessons.filter(l => l.level === filter);

    return (
        <section>
            <h2>Lessons</h2>
            <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                <option value="all">All Levels</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
            </select>
            <div className="grid-container">
                {filteredLessons.map(lesson => (
                    <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onComplete={handleComplete}
                        onReset={handleReset}
                        isCompleted={completedLessons.includes(lesson.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Lessons;
