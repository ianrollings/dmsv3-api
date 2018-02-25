const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: { type: Number },
    date: { type: Date },
    athletes: {
    	_id: { type: String },
    },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('Activity', activitySchema);