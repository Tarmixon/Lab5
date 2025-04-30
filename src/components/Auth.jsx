import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function Auth({ onAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = isLogin
                ? await signInWithEmailAndPassword(auth, email, password)
                : await createUserWithEmailAndPassword(auth, email, password);
            onAuth(userCredential.user);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="auth">
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} style={{cursor: "pointer"}}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
        </div>
    );
}
