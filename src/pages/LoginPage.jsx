import React, { useState } from "react";
import { auth } from "../firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate("/");
        } catch (err) {
            // Спрощуємо повідомлення про помилки Firebase для користувача
            if (err.code === 'auth/invalid-credential') {
                setError("Невірний email або пароль.");
            } else if (err.code === 'auth/email-already-in-use') {
                setError("Цей email вже використовується.");
            } else if (err.code === 'auth/weak-password') {
                setError("Пароль занадто слабкий (мінімум 6 символів).");
            } else {
                setError(err.message);
            }
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError("Будь ласка, введіть свій email у поле вище, щоб скинути пароль.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Лист для скидання пароля надіслано! Перевірте пошту.");
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    // Стиль для кнопок, які виглядають як текст (скасовуємо глобальний стиль кнопки)
    const linkButtonStyle = {
        background: "none",
        border: "none",
        color: "var(--primary-color)",
        cursor: "pointer",
        padding: "0",
        fontSize: "0.95rem",
        textDecoration: "underline",
        boxShadow: "none",
        transform: "none",
        fontWeight: "normal",
        marginTop: "5px"
    };

    return (
        // Використовуємо класи для центрування з App.css
        <div className="auth-page-container">
            <div className="auth-form-box">
                <h2>{isRegistering ? "Реєстрація" : "Вхід"}</h2>

                {message && (
                    <div style={{ 
                        backgroundColor: "#dcfce7", color: "#166534", 
                        padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "0.9rem" 
                    }}>
                        {message}
                    </div>
                )}
                
                {error && (
                    <div style={{ 
                        backgroundColor: "#fee2e2", color: "#991b1b", 
                        padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "0.9rem" 
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    {/* Головна кнопка (автоматично бере стиль з App.css) */}
                    <button type="submit" style={{ width: "100%", marginTop: "15px" }}>
                        {isRegistering ? "Зареєструватися" : "Увійти"}
                    </button>
                </form>

                <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#555" }}>
                    {!isRegistering && (
                        <div style={{ marginBottom: "10px" }}>
                            <button
                                onClick={handleResetPassword}
                                style={linkButtonStyle}
                            >
                                Забули пароль?
                            </button>
                        </div>
                    )}

                    <div style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
                        {isRegistering ? "Вже є акаунт? " : "Немає акаунту? "}
                        <button
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setMessage("");
                                setError("");
                            }}
                            style={{ ...linkButtonStyle, fontWeight: "bold" }}
                        >
                            {isRegistering ? "Увійти" : "Зареєструватися"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
