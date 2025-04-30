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
            setError(err.message);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError("Please enter your email first.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page">
            <h2>{isRegistering ? "Register" : "Login"}</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                        setMessage("");
                    }}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                        setMessage("");
                    }}
                    required
                />
                <button type="submit">{isRegistering ? "Register" : "Login"}</button>
            </form>

            {!isRegistering && (
                <button
                    onClick={handleResetPassword}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        marginTop: "10px",
                        cursor: "pointer",
                        textDecoration: "underline",
                    }}
                >
                    Forgot password?
                </button>
            )}

            <p style={{ marginTop: "10px" }}>
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setMessage("");
                        setError("");
                    }}
                    style={{ color: "#007bff", background: "none", border: "none", cursor: "pointer" }}
                >
                    {isRegistering ? "Login" : "Register"}
                </button>
            </p>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
