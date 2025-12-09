import React, { useState } from 'react';

export default function PracticePage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        if (selectedOption === QUESTIONS[currentQuestionIndex].correct) {
            setScore(score + 1);
        }

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < QUESTIONS.length) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedOption(null);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setIsFinished(false);
    };

    if (isFinished) {
        return (
            <div className="page" style={{textAlign: 'center'}}>
                <h2>Результати практики</h2>
                <div className="card" style={{padding: '40px'}}>
                    <div style={{fontSize: '4rem', marginBottom: '20px'}}>🎉</div>
                    <h3>Ваш результат: {score} з {QUESTIONS.length}</h3>
                    <p style={{color: '#666', marginBottom: '20px'}}>
                        {score === QUESTIONS.length ? "Ідеально! Ти майстер!" : "Хороша робота, продовжуй практикуватись!"}
                    </p>
                    <button onClick={handleRestart}>Спробувати ще раз</button>
                </div>
            </div>
        );
    }

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100);

    return (
        <div className="page">
            <div style={{maxWidth: '700px', margin: '0 auto'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <h2 style={{margin: 0}}>Практика</h2>
                    <span style={{color: '#666'}}>Питання {currentQuestionIndex + 1} з {QUESTIONS.length}</span>
                </div>

                {/* Прогрес бар */}
                <div style={{height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '30px'}}>
                    <div style={{
                        height: '100%', 
                        width: `${progress}%`, 
                        backgroundColor: '#4F46E5', 
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>

                <div className="card">
                    <h3 style={{fontSize: '1.4rem', marginBottom: '25px'}}>{currentQuestion.question}</h3>
                    
                    <div className="quiz-options">
                        {currentQuestion.options.map((option, index) => (
                            <label 
                                key={index} 
                                className={`quiz-option ${selectedOption === option ? 'selected' : ''}`}
                            >
                                <input 
                                    type="radio" 
                                    name="quiz-answer" 
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={() => handleOptionSelect(option)}
                                    className="custom-radio"
                                />
                                <span className="option-text">{option}</span>
                            </label>
                        ))}
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
                        <button 
                            onClick={handleNext} 
                            disabled={!selectedOption}
                            style={{padding: '12px 30px'}}
                        >
                            {currentQuestionIndex === QUESTIONS.length - 1 ? "Завершити" : "Далі"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
