'use strict';

// ================== DEPENDENCIES ==================

// Patch console.x methods in order to add timestamp information
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });

const config = require('./config/config');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require('cors');

// ================== MONGODB ==================

mongoose.connect(
    config.MONGO_DB_URI,
    { useNewUrlParser: true }
);
const monDb = mongoose.connection;

monDb.on('error', function() {
    console.error('MongoDB Connection Error. Please make sure that', config.MONGO_DB_NAME, 'is running.');
});

monDb.once('open', function callback() {
    console.info('Connected to MongoDB:', config.MONGO_DB_NAME);
});

// ================== APP ==================

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());

const port = config.PORT;
app.set('port', port);

const prefix = config.API_PREFIX;

// ================== ROUTES ==================

// GET /hello
app.get('/', (req, res) => {
    res.send({ express: 'Bazinga! Your API is working fine.' });
});

// const userRoutes = require('./api/user/userRoutes');

// app.use(prefix + '/users', userRoutes);

// ================== ERROR HANDLER ==================

// 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// DEV: does print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// PROD: does not print stacktrace
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// ================== SERVER ==================

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
