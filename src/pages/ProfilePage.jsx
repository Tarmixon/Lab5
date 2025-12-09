import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile, updatePassword, deleteUser, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setName(currentUser.displayName || '');
                setPhotoURL(currentUser.photoURL || '');
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // 1. Оновлення профілю (Ім'я та Фото)
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(user, {
                displayName: name,
                photoURL: photoURL
            });
            setMessage({ type: 'success', text: 'Профіль оновлено!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    // 2. Зміна паролю
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            await updatePassword(user, newPassword);
            setMessage({ type: 'success', text: 'Пароль успішно змінено!' });
            setNewPassword('');
        } catch (error) {
            // Firebase вимагає недавнього входу для зміни паролю
            if (error.code === 'auth/requires-recent-login') {
                setMessage({ type: 'error', text: 'Будь ласка, перезайдіть в акаунт, щоб змінити пароль.' });
            } else {
                setMessage({ type: 'error', text: error.message });
            }
        }
    };

    // 3. Видалення акаунту
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Ви впевнені? Цю дію неможливо скасувати. Всі ваші дані будуть втрачені.");
        if (!confirmDelete) return;

        try {
            // Спочатку чистимо базу даних (MongoDB)
            await fetch(`/api/user-all-data?userId=${user.uid}`, { method: 'DELETE' });

            // Потім видаляємо юзера з Firebase
            await deleteUser(user);
            
            navigate('/login');
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                alert('З міркувань безпеки, будь ласка, вийдіть і увійдіть знову, щоб видалити акаунт.');
            } else {
                console.error("Помилка видалення:", error);
                alert("Помилка: " + error.message);
            }
        }
    };

    if (!user) return <p>Завантаження...</p>;

    return (
        <div className="page" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Налаштування профілю</h2>

            {/* Відображення аватара */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img 
                    src={user.photoURL || "https://via.placeholder.com/150"} 
                    alt="Avatar" 
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }}
                />
                <p>Email: <strong>{user.email}</strong></p>
            </div>

            {message.text && (
                <div style={{
                    padding: '10px', marginBottom: '15px', borderRadius: '5px',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b'
                }}>
                    {message.text}
                </div>
            )}

            <div className="card">
                <h3>Основна інформація</h3>
                <form onSubmit={handleUpdateProfile}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Ім'я:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>URL фото профілю:</label>
                        <input 
                            type="text" 
                            value={photoURL} 
                            onChange={(e) => setPhotoURL(e.target.value)} 
                            placeholder="https://example.com/photo.jpg"
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#4F46E5' }}>Зберегти зміни</button>
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h3>Змінити пароль</h3>
                <form onSubmit={handleUpdatePassword}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Новий пароль:</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="Мінімум 6 символів"
                            required
                            minLength={6}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#f59e0b' }}>Оновити пароль</button>
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px', border: '1px solid #ef4444' }}>
                <h3 style={{ color: '#ef4444' }}>Небезпечна зона</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Видалення акаунту призведе до втрати всього прогресу та статистики.
                </p>
                <button 
                    onClick={handleDeleteAccount} 
                    style={{ backgroundColor: '#ef4444', marginTop: '10px' }}
                >
                    Видалити акаунт
                </button>
            </div>
        </div>
    );
}
