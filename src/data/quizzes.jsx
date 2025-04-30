
export const quizzes = [
    {
        title: "Test 1: Greetings",
        question: "How do you say 'Hello' in French?",
        type: "radio",
        name: "greeting",
        options: [
            { label: "Bonjour", value: "correct" },
            { label: "Hola", value: "wrong" },
            { label: "Ciao", value: "wrong" }
        ]
    },
    {
        title: "Test 2: Ordering Food",
        question: "Which phrase means 'I would like a coffee'?",
        type: "radio",
        name: "food",
        options: [
            { label: "Je voudrais un café", value: "correct" },
            { label: "Ich möchte einen Kaffee", value: "wrong" },
            { label: "Yo quiero un café", value: "wrong" }
        ]
    },
    {
        title: "Test 3: Goodbye",
        question: "Which of the following are ways to say 'Goodbye'?",
        type: "checkbox",
        options: [
            { label: "Adieu", correct: true },
            { label: "Auf Wiedersehen", correct: true },
            { label: "Bonjour", correct: false }
        ]
    }
];
