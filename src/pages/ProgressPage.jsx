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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                calculateProgress(currentUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const calculateProgress = async (userId) => {
        try {
            // 1. Спочатку отримуємо список ВАЛІДНИХ (існуючих) уроків з Firestore
            // Використовуємо getDocs замість getCountFromServer, щоб отримати ID
            const lessonsSnapshot = await getDocs(collection(db, "lessons"));
            const validLessonIds = lessonsSnapshot.docs.map(doc => doc.id);
            const totalCount = validLessonIds.length;

            // 2. Отримуємо список виконаних із сервера
            const res = await fetch(`/api/completed?userId=${userId}`);
            const completedData = await res.json();

            // 3. ФІЛЬТРАЦІЯ: Залишаємо тільки ті виконані уроки, які досі існують
            // Це прибере "привидів" (уроки, які ти видалив, але прогрес залишився)
            const validCompleted = completedData.filter(item => 
                validLessonIds.includes(item.lessonId)
            );
            
            const completedCount = validCompleted.length;

            // 4. Рахуємо відсоток
            const percentage = totalCount > 0 
                ? Math.round((completedCount / totalCount) * 100) 
                : 0;

            setStats({ 
                total: totalCount, 
                completed: completedCount, 
                percentage 
            });
        } catch (error) {
            console.error("Помилка завантаження прогресу:", error);
        }
    };

    if (!user) {
        return (
            <div className="page">
                <p>Будь ласка, увійдіть, щоб переглянути свій прогрес.</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h2>Мій прогрес</h2>
            
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <h3>Загальний результат</h3>
                <p style={{ fontSize: "1.2rem", color: "#555" }}>
                    Виконано <strong>{stats.completed}</strong> з <strong>{stats.total}</strong> уроків
                </p>
            </div>

            <Progress label="Всі уроки" value={stats.percentage} />

            <div style={{ marginTop: "40px" }}>
                <Timer />
            </div>
        </div>
    );
}
