import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Lessons() {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "lessons"));
                const lessonsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLessons(lessonsData);
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        };

        fetchLessons();
    }, []);

    return (
        <div className="page">
            <h2>Lessons</h2>
            {lessons.map(lesson => (
                <div key={lesson.id} className="card">
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                    <iframe
                        width="100%"
                        height="200"
                        src={lesson.video}
                        frameBorder="0"
                        allowFullScreen
                        title={lesson.title}
                    />
                </div>
            ))}
        </div>
    );
}
