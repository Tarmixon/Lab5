import React from 'react';

const Practice = () => {
    const checkAnswer = (e) => {
        const isCorrect = e.target.dataset.correct === 'true';
        alert(isCorrect ? 'Correct!' : 'Try again!');
    };

    return (
        <section>
            <h2>Practice</h2>
            <div className="quiz">
                <h3>How do you say "Hello" in French?</h3>
                <button data-correct="true" onClick={checkAnswer}>Bonjour</button>
                <button data-correct="false" onClick={checkAnswer}>Hola</button>
                <button data-correct="false" onClick={checkAnswer}>Ciao</button>
            </div>
        </section>
    );
};

export default Practice;
