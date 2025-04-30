// components/Quiz.js
import React, { useState } from "react";

export default function Quiz({ quiz }) {
    const [result, setResult] = useState(null);

    const checkAnswer = () => {
        let isCorrect = false;

        if (quiz.type === "radio") {
            const selected = document.querySelector(`input[name="${quiz.name}"]:checked`);
            if (selected && selected.value === "correct") {
                isCorrect = true;
            }
        } else if (quiz.type === "checkbox") {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const answers = Array.from(checkboxes).map((box, i) => box.checked === quiz.options[i].correct);
            isCorrect = answers.every(a => a === true);
        }

        setResult(isCorrect ? "Correct!" : "Try again!");
    };

    return (
        <div className="quiz">
            <h3>{quiz.title}</h3>
            <p>{quiz.question}</p>
            {quiz.options.map((option, index) => (
                <div key={index}>
                    <input
                        type={quiz.type}
                        name={quiz.name || `q-${quiz.title}`}
                        id={`${quiz.title}-${index}`}
                        value={option.value || ""}
                    />
                    <label htmlFor={`${quiz.title}-${index}`}>{option.label}</label>
                </div>
            ))}
            <button onClick={checkAnswer}>Submit</button>
            {result && <p className="quiz-result">{result}</p>}
        </div>
    );
}
