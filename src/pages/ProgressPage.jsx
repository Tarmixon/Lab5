import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getCountFromServer } from "firebase/firestore"; 
import Progress from "../components/Progress";
import Timer from "../components/Timer";

export default function ProgressPage() {
    const [user, setUser] = useState(null);
    // Стан для збереження реальної статистики
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
            // 1. Отримуємо список виконаних уроків з твого сервера (MongoDB)
            // Використовуємо відносний шлях для Render
            const res = await fetch(`/api/completed?userId=${userId}`);
            const completedData = await res.json();
            const completedCount = completedData.length;

            // 2. Отримуємо загальну кількість уроків з Firestore
            // getCountFromServer - це ефективний спосіб порахувати документи без їх завантаження
            const coll = collection(db, "lessons");
            const snapshot = await getCountFromServer(coll);
            const totalCount = snapshot.data().count;

            // 3. Рахуємо відсоток
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

            {/* Компонент Progress тепер показує реальний відсоток */}
            <Progress label="Всі уроки" value={stats.percentage} />

            {/* Таймер можна залишити як додаткову функцію */}
            <div style={{ marginTop: "40px" }}>
                <Timer />
            </div>
        </div>
    );
}
