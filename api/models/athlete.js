const mongoose = require('mongoose');

const athleteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    birthdate: { type: Date },
    gender: { type: String, required: true },
    email: { type: String },
    created: { type: Date, default: Date.now },
    modified: { type: Date }
});

module.exports = mongoose.model('Athlete', athleteSchema);