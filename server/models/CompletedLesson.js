const mongoose = require("mongoose");

const CompletedLessonSchema = new mongoose.Schema({
    userId: String,
    lessonId: String,
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CompletedLesson", CompletedLessonSchema);
