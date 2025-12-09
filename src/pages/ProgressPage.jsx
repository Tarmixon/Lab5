import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore"; 
import Progress from "../components/Progress";
import Timer from "../components/Timer";

export default function ProgressPage() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        percentage: 0
    });
    // Новий стан для мотиваційного повідомлення
    const [motivation, setMotivation] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                calculateProgress(currentUser.uid);
                fetchComparisonStats(currentUser.uid); // <-- Викликаємо нову функцію
            }
        });

        return () => unsubscribe();
    }, []);

    // ... (твоя функція calculateProgress залишається без змін) ...
    const calculateProgress = async (userId) => {
        try {
            const lessonsSnapshot = await getDocs(collection(db, "lessons"));
            const validLessonIds = lessonsSnapshot.docs.map(doc => doc.id);
            const totalCount = validLessonIds.length;

            const res = await fetch(`/api/completed?userId=${userId}`);
            const completedData = await res.json();

            const validCompleted = completedData.filter(item => 
                validLessonIds.includes(item.lessonId)
            );
            
            const completedCount = validCompleted.length;
            const percentage = totalCount > 0 
                ? Math.round((completedCount / totalCount) * 100) 
                : 0;

            setStats({ total: totalCount, completed: completedCount, percentage });
        } catch (error) {
            console.error("Помилка завантаження прогресу:", error);
        }
    };

    // 👇 НОВА ФУНКЦІЯ: Отримуємо "соціальну" статистику
    const fetchComparisonStats = async (userId) => {
        try {
            const res = await fetch(`/api/stats?userId=${userId}`);
            const data = await res.json();
            setMotivation(data);
        } catch (error) {
            console.error("Помилка статистики:", error);
        }
    };

    if (!user) {
        return <div className="page"><p>Будь ласка, увійдіть.</p></div>;
    }

    return (
        <div className="page">
            <h2>Мій прогрес</h2>
            
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <h3>Загальний результат</h3>
                <p style={{ fontSize: "1.2rem", color: "#555" }}>
                    Виконано <strong>{stats.completed}</strong> з <strong>{stats.total}</strong> уроків
                </p>
                
                {/* 👇 Відображення мотивації */}
                {motivation && (
                    <div style={{ 
                        marginTop: "15px", 
                        padding: "15px", 
                        backgroundColor: "#e0f2fe", 
                        borderRadius: "8px",
                        color: "#0369a1",
                        fontWeight: "bold"
                    }}>
                        🏆 {motivation.message}
                    </div>
                )}
            </div>

            <Progress label="Всі уроки" value={stats.percentage} />

            <div style={{ marginTop: "40px" }}>
                <Timer />
            </div>
        </div>
    );
}
