const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('./cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

const routes = require('./routes');
const AppError = require('./utils/appError');

/* Adding all express methods into the app */
const app = express();
/* ------------------------------------------
Middlewares
------------------------------------------ */
/* Set security HTTP headers */
app.use(helmet());
/* Request logger for node in dev mode */
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}
/* Rate Limiting requests from the same IP */
const limiter = rateLimit({
   max: 150,
   windowMs: 60 * 60 * 1000,
   message: 'Too many request from this IP. Please try again in an hour!'
});
app.use('/api', limiter);
/* Body parser, exposing the request's data into the req.body */
app.use(express.json({ limit: '10kb' }));
/* URL Encoded, parsing data obj w nested obj */
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
/* Use my CORS settings while accessing the API */
app.options('*', cors)
app.use(cors);
/* Using static file from the public folder */
app.use(express.static(path.join(__dirname, 'public')));
/* Sanitize user input from POST body, GET queries, and url params */
app.use(xss());
/* Prevent HTTP Parameter Pollution */
app.use(hpp());

app.use('/api/v1', routes);

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} route on the server!`, 404));
});
/* Global error handling middleware */
app.use((err, req, res, next) => {
   if (res.headerSent) {
      return next(err);
   }
   res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message || 'An unknown error occurred!'
   });
});

module.exports = app;