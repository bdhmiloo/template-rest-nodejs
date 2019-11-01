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

mongoose.Promise = global.Promise;

mongoose.connect(
    config.MONGO_DB_URI,
    { useNewUrlParser: true }
).then(() => {
    console.info('Connected to MongoDB:', config.MONGO_DB_NAME);
}).catch(err => {
    console.error('MongoDB Connection Error. Please make sure that', config.MONGO_DB_NAME, 'is running.', err);
    process.exit();
});

// ================== APP ==================

const server = express();
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(methodOverride('X-HTTP-Method-Override'));
server.use(cors());

const port = config.PORT;
server.set('port', port);

const prefix = config.API_PREFIX;

// ================== ROUTES ==================

server.get('/', (req, res) => {
    res.send({ express: 'Bazinga! Your API is working fine.' });
});

const userRoutes = require('./api/routes/userRoutes');

server.use(prefix + '/users', userRoutes);

// ================== ERROR HANDLER ==================

// 404
server.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// DEV: does print stacktrace
if (server.get('env') === 'development') {
    server.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// PROD: does not print stacktrace
server.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// ================== SERVER ==================

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;
