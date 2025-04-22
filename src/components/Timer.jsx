import React, { useEffect, useState } from 'react';

const Timer = () => {
    const [time, setTime] = useState(() => parseInt(localStorage.getItem('studyTime')) || 0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => {
                const updated = prev + 1;
                localStorage.setItem('studyTime', updated);
                return updated;
            });
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const resetTime = () => {
        setTime(0);
        localStorage.setItem('studyTime', '0');
    };

    return (
        <div>
            <h3>Study Time: {time} minutes</h3>
            <button onClick={resetTime}>Reset Timer</button>
        </div>
    );
};

export default Timer;
