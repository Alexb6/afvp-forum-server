const express = require('express');
const morgan = require('morgan');
const cors = require('./cors');

const routes = require('./routes');

/* Adding all express methods into the app */
const app = express();
/* ------------------------------------------
Middlewares
------------------------------------------ */
/* Request logger for node in dev mode */
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}
/* Body parser, exposing the request's data into the req.body */
app.use(express.json({ limit: '10kb' }));
/* URL Encoded, parsing data obj w nested obj */
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
/* Use my CORS settings while accessing the API */
app.options('*', cors)
app.use(cors);

app.use('/api/v1', routes);

module.exports = app;