
import React from "react";
import Quiz from "../components/Quiz";
import { quizzes } from "../data/quizzes";

export default function PracticePage() {
    return (
        <div className="page">
            <h2>Practice</h2>
            {quizzes.map((quiz, index) => (
                <Quiz key={index} quiz={quiz} />
            ))}
        </div>
    );
}
