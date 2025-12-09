import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div>
                    <p>&copy; {new Date().getFullYear()} Language Learning Platform.</p>
                    <p style={{fontSize: "0.8rem", marginTop: "5px"}}>Designed for Students.</p>
                </div>
                <div className="footer-links">
                    <a href="/">Головна</a>
                    <a href="/about">Про нас</a>
                    <a href="/contact">Контакти</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
