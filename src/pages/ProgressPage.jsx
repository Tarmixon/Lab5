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
    //  Нові стани для детальної статистики
    const [langStats, setLangStats] = useState({});
    const [levelStats, setLevelStats] = useState({});
    
    const [motivation, setMotivation] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                calculateProgress(currentUser.uid);
                fetchComparisonStats(currentUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const calculateProgress = async (userId) => {
        try {
            // 1. Отримуємо всі уроки з даними (щоб знати мову і рівень)
            const lessonsSnapshot = await getDocs(collection(db, "lessons"));
            const allLessons = lessonsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // 2. Отримуємо список виконаних ID
            const res = await fetch(`/api/completed?userId=${userId}`);
            const completedData = await res.json();
            // Створюємо Set для швидкого пошуку
            const completedSet = new Set(completedData.map(item => item.lessonId));

            // 3. Змінні для підрахунку
            let totalValid = 0;
            let completedValid = 0;
            const tempLangStats = {};
            const tempLevelStats = {};

            // 4. Проходимо по кожному уроку і рахуємо статистику
            allLessons.forEach(lesson => {
                const isCompleted = completedSet.has(lesson.id);
                totalValid++;
                if (isCompleted) completedValid++;

                // -- Статистика по мовах --
                const lang = lesson.language || "Other"; // Якщо мова не вказана
                if (!tempLangStats[lang]) tempLangStats[lang] = { total: 0, completed: 0 };
                tempLangStats[lang].total++;
                if (isCompleted) tempLangStats[lang].completed++;

                // -- Статистика по рівнях --
                const level = lesson.level || "Unknown"; // Якщо рівень не вказаний
                if (!tempLevelStats[level]) tempLevelStats[level] = { total: 0, completed: 0 };
                tempLevelStats[level].total++;
                if (isCompleted) tempLevelStats[level].completed++;
            });

            // 5. Оновлюємо загальний стейт
            const percentage = totalValid > 0 ? Math.round((completedValid / totalValid) * 100) : 0;
            setStats({ total: totalValid, completed: completedValid, percentage });
            
            setLangStats(tempLangStats);
            setLevelStats(tempLevelStats);

        } catch (error) {
            console.error("Помилка завантаження прогресу:", error);
        }
    };

    const fetchComparisonStats = async (userId) => {
        try {
            const res = await fetch(`/api/stats?userId=${userId}`);
            const data = await res.json();
            setMotivation(data);
        } catch (error) {
            console.error("Помилка статистики:", error);
        }
    };

    // Допоміжна функція для рендеру списку прогрес-барів
    const renderStatsList = (statsObj, title) => {
        const keys = Object.keys(statsObj);
        if (keys.length === 0) return null;

        return (
            <div style={{ marginTop: "30px" }}>
                <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>{title}</h4>
                {keys.map(key => {
                    const item = statsObj[key];
                    const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                    return (
                        <div key={key} style={{ marginBottom: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "5px" }}>
                                <span>{key}</span>
                                <span>{item.completed}/{item.total}</span>
                            </div>
                            <Progress value={pct} />
                        </div>
                    );
                })}
            </div>
        );
    };

    if (!user) return <div className="page"><p>Будь ласка, увійдіть.</p></div>;

    return (
        <div className="page">
            <h2>Мій прогрес</h2>
            
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <h3>Загальний результат</h3>
                <p style={{ fontSize: "1.2rem", color: "#555" }}>
                    Виконано <strong>{stats.completed}</strong> з <strong>{stats.total}</strong> уроків
                </p>
                <Progress label="Всі уроки" value={stats.percentage} />

                {motivation && (
                    <div style={{ 
                        marginTop: "15px", padding: "15px", 
                        backgroundColor: "#e0f2fe", borderRadius: "8px", 
                        color: "#0369a1", fontWeight: "bold"
                    }}>
                        🏆 {motivation.message}
                    </div>
                )}
            </div>

            {/* 👇 Секції з детальною статистикою */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                    {renderStatsList(langStats, "По мовах 🌍")}
                </div>
                <div>
                    {renderStatsList(levelStats, "По рівнях 📈")}
                </div>
            </div>

            <div style={{ marginTop: "40px" }}>
                <Timer />
            </div>
        </div>
    );
}
