import React from 'react';

export default function ContactPage() {
    return (
        <div className="page">
            <h2>Контакти</h2>

            <div className="card">
                <p>Маєте запитання чи пропозиції? Зв'яжіться з нами!</p>
                <p>📧 <strong>Email:</strong> taras.matsiiovskyi.oi.2023@lpnu.ua</p>
                <p>📍 <strong>Адреса:</strong> Львів, Україна</p>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h3>Напишіть нам</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert("Повідомлення надіслано!"); }}>
                    <input type="text" placeholder="Ваше ім'я" required />
                    <input type="email" placeholder="Ваш Email" required />
                    <textarea 
                        rows="4" 
                        placeholder="Ваше повідомлення..." 
                        required
                        style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '10px', border: '1px solid #d1d5db' }}
                    ></textarea>
                    <button type="submit" style={{ marginTop: '15px' }}>Надіслати</button>
                </form>
            </div>
        </div>
    );
}
