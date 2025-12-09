const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const StudyTime = require("./models/StudyTime");
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

// Статистика порівняно з іншими
app.get("/api/stats", async (req, res) => {
    const { userId } = req.query;
    try {
        // 1. Агрегація: рахуємо, скільки уроків виконав КОЖЕН користувач
        const allUsersProgress = await CompletedLesson.aggregate([
            { 
                $group: { 
                    _id: "$userId",   // Групуємо по ID юзера
                    count: { $sum: 1 } // Рахуємо кількість документів
                } 
            }
        ]);

        // 2. Знаходимо результат поточного користувача
        const currentUserData = allUsersProgress.find(u => u._id === userId);
        const userScore = currentUserData ? currentUserData.count : 0;

        // 3. Рахуємо статистику
        const totalUsers = allUsersProgress.length;
        
        if (totalUsers <= 1) {
            return res.json({ 
                percentile: 100, 
                message: "Ви — наш перший або єдиний активний студент! Так тримати!" 
            });
        }

        // Рахуємо, скільки людей мають МЕНШЕ виконаних уроків, ніж поточний юзер
        const usersWorseThanMe = allUsersProgress.filter(u => u.count < userScore).length;

        // Формула перцентилю: (кількість людей нижче / загальна кількість) * 100
        const percentile = Math.round((usersWorseThanMe / (totalUsers - 1)) * 100);

        res.json({
            userScore,
            totalUsers,
            percentile,
            message: `Ви працюєте краще, ніж ${percentile}% інших студентів!`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//Таймер
app.get("/api/timer", async (req, res) => {
    const { userId } = req.query;
    try {
        let record = await StudyTime.findOne({ userId });
        if (!record) {
            record = await StudyTime.create({ userId, totalSeconds: 0 });
        }
        res.json({ totalSeconds: record.totalSeconds });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ОНОВИТИ час (додати секунди)
app.post("/api/timer", async (req, res) => {
    const { userId, secondsToAdd } = req.body;
    try {
        const record = await StudyTime.findOneAndUpdate(
            { userId },
            { $inc: { totalSeconds: secondsToAdd }, lastUpdated: new Date() }, // $inc додає до існуючого значення
            { new: true, upsert: true } // створює, якщо немає
        );
        res.json({ totalSeconds: record.totalSeconds });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/user-all-data", async (req, res) => {
    const { userId } = req.query;
    try {
        // Видаляємо всі завершені уроки
        await CompletedLesson.deleteMany({ userId });
        // Видаляємо запис про час
        await StudyTime.deleteOne({ userId });
        
        res.status(200).json({ message: "Всі дані користувача видалено" });
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
