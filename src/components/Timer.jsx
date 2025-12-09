import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase'; // Імпорт auth для отримання ID користувача

const Timer = () => {
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [sessionSeconds, setSessionSeconds] = useState(0); // Час поточної сесії
    const [isActive, setIsActive] = useState(false);
    const [user, setUser] = useState(null);
    
    // Використовуємо ref, щоб зберігати актуальні значення для таймера збереження
    const sessionSecondsRef = useRef(0);

    // 1. Слідкуємо за авторизацією
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchServerTime(currentUser.uid);
            } else {
                setTotalSeconds(0);
                setIsActive(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Функція завантаження часу з сервера
    const fetchServerTime = async (userId) => {
        try {
            const res = await fetch(`/api/timer?userId=${userId}`);
            const data = await res.json();
            setTotalSeconds(data.totalSeconds);
        } catch (error) {
            console.error("Помилка завантаження часу:", error);
        }
    };

    // 3. Функція збереження на сервер (відправляє тільки нові секунди)
    const saveTimeToServer = async (seconds) => {
        if (!user || seconds === 0) return;

        try {
            await fetch("/api/timer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.uid,
                    secondsToAdd: seconds
                })
            });
            // Після успішного збереження скидаємо лічильник сесії, 
            // бо ці секунди вже враховані в базі
            sessionSecondsRef.current = 0; 
            setSessionSeconds(0); 
        } catch (error) {
            console.error("Помилка збереження часу:", error);
        }
    };

    // 4. Основний таймер (рахує кожну секунду)
    useEffect(() => {
        let interval = null;
        if (isActive && user) {
            interval = setInterval(() => {
                setTotalSeconds(prev => prev + 1);
                setSessionSeconds(prev => prev + 1);
                sessionSecondsRef.current += 1;
            }, 1000);
        } else if (!isActive && totalSeconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, user, totalSeconds]);

    // 5. Автозбереження кожні 30 секунд (щоб не втратити прогрес при закритті)
    useEffect(() => {
        const saveInterval = setInterval(() => {
            if (user && sessionSecondsRef.current > 0) {
                saveTimeToServer(sessionSecondsRef.current);
            }
        }, 30000); // 30 секунд

        return () => clearInterval(saveInterval);
    }, [user]);

    // Форматування часу (hh:mm:ss)
    const formatTime = (totalSecs) => {
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        
        // Додаємо нуль спереду, якщо число менше 10
        const pad = (num) => num.toString().padStart(2, '0');
        
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    if (!user) return null; // Не показувати таймер неавторизованим

    return (
        <div className="timer-container" style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '10px', 
            textAlign: 'center', 
            marginTop: '20px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3>⏱️ Час навчання</h3>
            <div className="time-display" style={{ fontSize: '2rem', margin: '10px 0', fontFamily: 'monospace' }}>
                {formatTime(totalSeconds)}
            </div>
            <div className="timer-controls">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '1rem',
                        backgroundColor: isActive ? '#ef4444' : '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {isActive ? 'Пауза' : 'Старт'}
                </button>
                <button 
                    onClick={() => {
                        // Примусове збереження перед виходом
                        saveTimeToServer(sessionSecondsRef.current);
                        alert("Прогрес збережено!");
                    }}
                    style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        fontSize: '1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Зберегти
                </button>
            </div>
            <p style={{fontSize: '0.8rem', color: '#888', marginTop: '10px'}}>
                Автозбереження кожні 30 сек
            </p>
        </div>
    );
};

export default Timer;
