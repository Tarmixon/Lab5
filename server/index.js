const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const CompletedLesson = require("./models/CompletedLesson");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // щоб читати JSON у запитах

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("🟢 Підключено до MongoDB"))
    .catch(err => console.error("❌ Помилка MongoDB:", err));

// Зберегти завершений урок
app.post("/api/completed", async (req, res) => {
    const { userId, lessonId } = req.body;
    try {
        const existing = await CompletedLesson.findOne({ userId, lessonId });
        if (!existing) {
            await CompletedLesson.create({ userId, lessonId });
        }
        res.status(200).json({ message: "Збережено" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Отримати завершені уроки для користувача (фільтрація по даті)
app.get("/api/completed", async (req, res) => {
    const { userId, from, to } = req.query;
    try {
        const query = { userId };
        if (from || to) {
            query.completedAt = {};
            if (from) query.completedAt.$gte = new Date(from);
            if (to) query.completedAt.$lte = new Date(to);
        }

        const completedLessons = await CompletedLesson.find(query);
        res.json(completedLessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Видалити запис про завершений урок
app.delete("/api/completed", async (req, res) => {
    // Важливо: для DELETE читаємо параметри з req.query (адресний рядок)
    const { userId, lessonId } = req.query; 
    
    try {
        await CompletedLesson.findOneAndDelete({ userId, lessonId });
        res.status(200).json({ message: "Прогрес скинуто" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// СТАТИЧНІ ФАЙЛИ REACT
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(PORT, () => {
    console.log(`🌐 Сервер запущено на http://localhost:${PORT}`);
});
