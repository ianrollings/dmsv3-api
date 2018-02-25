const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());

const activityRoutes = require('./api/routes/activities');
const athleteRoutes = require('./api/routes/athletes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/activities', activityRoutes);
app.use('/athletes', athleteRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;