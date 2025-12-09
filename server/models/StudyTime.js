const mongoose = require("mongoose");

const StudyTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    totalSeconds: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudyTime", StudyTimeSchema);
