import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Progress from "../components/Progress"; // компонент лінії прогресу
import Timer from "../components/Timer";       // таймер, якщо хочеш залишити

export default function ProgressPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return <p>Please log in to view your progress.</p>;
    }

    return (
        <div className="page">
            <h2>My Progress</h2>
            <Progress label="Listening" value={70} />
            <Progress label="Speaking" value={50} />
            <Progress label="Reading" value={80} />
            <Progress label="Writing" value={60} />
            <Timer />
        </div>
    );
}
